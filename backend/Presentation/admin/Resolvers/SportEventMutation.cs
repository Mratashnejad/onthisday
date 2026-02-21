using HotChocolate;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using OnThisDay.Api.Application.Auth;
using OnThisDay.Api.Domain.Entities;
using OnThisDay.Api.Domain.Utilities;
using OnThisDay.Api.Infrastructure.Data;
using DomainLocation = OnThisDay.Api.Domain.Entities.Location;

namespace OnThisDay.Api.Presentation.Admin.Resolvers;

public sealed class SportEventMutation
{
    private readonly IServiceScopeFactory _scopeFactory;

    public SportEventMutation(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task<AuthPayload> LoginAdmin(
        string usernameOrEmail,
        string password,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var _signInManager = scope.ServiceProvider.GetRequiredService<SignInManager<User>>();
        var _jwtTokenService = scope.ServiceProvider.GetRequiredService<IJwtTokenService>();

        var normalized = usernameOrEmail.Trim().ToUpperInvariant();
        var user = await _userManager.Users.FirstOrDefaultAsync(
            u =>
                u.NormalizedUserName == normalized
                || u.NormalizedEmail == normalized,
            ct
        );

        if (user is null || !user.IsActive)
        {
            throw Unauthorized("Admin user not found or inactive.");
        }

        var signIn = await _signInManager.CheckPasswordSignInAsync(
            user,
            password,
            lockoutOnFailure: false
        );

        if (!signIn.Succeeded)
        {
            throw Unauthorized("Invalid username/email or password.");
        }

        return _jwtTokenService.CreateAdminToken(user);
    }

    public async Task<Sport> CreateSport(
        string name,
        SportType type,
        string? slug,
        string? description,
        string? iconUrl,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var finalSlug = BuildSlug(slug, name);
        var exists = await _db.Sports.AnyAsync(s => s.Slug == finalSlug, ct);
        if (exists)
        {
            throw Conflict($"Sport slug '{finalSlug}' already exists.");
        }

        var sport = new Sport
        {
            Name = name.Trim(),
            Slug = finalSlug,
            Type = type,
            Description = description,
            IconUrl = iconUrl
        };

        await _db.Sports.AddAsync(sport, ct);
        await _db.SaveChangesAsync(ct);
        return sport;
    }

    public async Task<Sport> UpdateSport(
        int id,
        string name,
        SportType type,
        string? slug,
        string? description,
        string? iconUrl,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var sport = await _db.Sports.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (sport is null)
        {
            throw NotFound($"Sport with id '{id}' not found.");
        }

        var finalSlug = BuildSlug(slug, name);
        var exists = await _db.Sports.AnyAsync(s => s.Slug == finalSlug && s.Id != id, ct);
        if (exists)
        {
            throw Conflict($"Sport slug '{finalSlug}' already exists.");
        }

        sport.Name = name.Trim();
        sport.Slug = finalSlug;
        sport.Type = type;
        sport.Description = description;
        sport.IconUrl = iconUrl;

        await _db.SaveChangesAsync(ct);
        return sport;
    }

    public async Task<bool> DeleteSport(int id, CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var sport = await _db.Sports.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (sport is null)
        {
            return false;
        }

        var teams = await _db.Set<Team>()
            .Where(t => EF.Property<int?>(t, "SportId") == id)
            .ToListAsync(ct);
        foreach (var team in teams)
        {
            team.Sport = null;
        }

        _db.Sports.Remove(sport);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<DomainLocation> CreateLocation(
        string name,
        string? slug,
        string? city,
        string? country,
        string? description,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var finalSlug = BuildSlug(slug, name);
        var exists = await _db.Set<DomainLocation>().AnyAsync(l => l.Slug == finalSlug, ct);
        if (exists)
        {
            throw Conflict($"Location slug '{finalSlug}' already exists.");
        }

        var location = new DomainLocation
        {
            Name = name.Trim(),
            Slug = finalSlug,
            City = city,
            Country = country,
            Description = description
        };

        await _db.Set<DomainLocation>().AddAsync(location, ct);
        await _db.SaveChangesAsync(ct);
        return location;
    }

    public async Task<DomainLocation> UpdateLocation(
        int id,
        string name,
        string? slug,
        string? city,
        string? country,
        string? description,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var location = await _db.Set<DomainLocation>().FirstOrDefaultAsync(l => l.Id == id, ct);
        if (location is null)
        {
            throw NotFound($"Location with id '{id}' not found.");
        }

        var finalSlug = BuildSlug(slug, name);
        var exists = await _db.Set<DomainLocation>()
            .AnyAsync(l => l.Slug == finalSlug && l.Id != id, ct);
        if (exists)
        {
            throw Conflict($"Location slug '{finalSlug}' already exists.");
        }

        location.Name = name.Trim();
        location.Slug = finalSlug;
        location.City = city;
        location.Country = country;
        location.Description = description;

        await _db.SaveChangesAsync(ct);
        return location;
    }

    public async Task<bool> DeleteLocation(int id, CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var location = await _db.Set<DomainLocation>().FirstOrDefaultAsync(l => l.Id == id, ct);
        if (location is null)
        {
            return false;
        }

        var teams = await _db.Set<Team>()
            .Where(t => EF.Property<int?>(t, "LocationId") == id)
            .ToListAsync(ct);
        foreach (var team in teams)
        {
            team.Location = null;
        }

        var events = await _db.SportEvents.Where(e => e.LocationId == id).ToListAsync(ct);
        foreach (var sportEvent in events)
        {
            sportEvent.LocationId = null;
        }

        _db.Set<DomainLocation>().Remove(location);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<Competition> CreateCompetition(
        string name,
        int sportId,
        CompetitionLevel level,
        string? shortName,
        string? slug,
        string? description,
        string? logoUrl,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var sport = await _db.Sports.FirstOrDefaultAsync(s => s.Id == sportId, ct);
        if (sport is null)
        {
            throw NotFound($"Sport with id '{sportId}' not found.");
        }

        var finalSlug = BuildSlug(slug, name);
        var exists = await _db.Set<Competition>().AnyAsync(c => c.Slug == finalSlug, ct);
        if (exists)
        {
            throw Conflict($"Competition slug '{finalSlug}' already exists.");
        }

        var competition = new Competition
        {
            Name = name.Trim(),
            ShortName = shortName,
            Slug = finalSlug,
            Level = level,
            Description = description,
            LogoUrl = logoUrl,
            SportId = sport.Id
        };

        await _db.Set<Competition>().AddAsync(competition, ct);
        await _db.SaveChangesAsync(ct);
        return competition;
    }

    public async Task<Competition> UpdateCompetition(
        int id,
        string name,
        int sportId,
        CompetitionLevel level,
        string? shortName,
        string? slug,
        string? description,
        string? logoUrl,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var competition = await _db.Set<Competition>().FirstOrDefaultAsync(c => c.Id == id, ct);
        if (competition is null)
        {
            throw NotFound($"Competition with id '{id}' not found.");
        }

        var sport = await _db.Sports.FirstOrDefaultAsync(s => s.Id == sportId, ct);
        if (sport is null)
        {
            throw NotFound($"Sport with id '{sportId}' not found.");
        }

        var finalSlug = BuildSlug(slug, name);
        var exists = await _db.Set<Competition>().AnyAsync(c => c.Slug == finalSlug && c.Id != id, ct);
        if (exists)
        {
            throw Conflict($"Competition slug '{finalSlug}' already exists.");
        }

        competition.Name = name.Trim();
        competition.ShortName = shortName;
        competition.Slug = finalSlug;
        competition.Level = level;
        competition.Description = description;
        competition.LogoUrl = logoUrl;
        competition.SportId = sport.Id;

        await _db.SaveChangesAsync(ct);
        return competition;
    }

    public async Task<bool> DeleteCompetition(int id, CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var competition = await _db.Set<Competition>().FirstOrDefaultAsync(c => c.Id == id, ct);
        if (competition is null)
        {
            return false;
        }

        var events = await _db.SportEvents.Where(e => e.CompetitionId == id).ToListAsync(ct);
        foreach (var sportEvent in events)
        {
            sportEvent.CompetitionId = null;
        }

        _db.Set<Competition>().Remove(competition);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<Team> CreateTeam(
        string name,
        int foundedYear,
        string? slug,
        string? description,
        string? iconUrl,
        string? websiteUrl,
        int? sportId,
        int? locationId,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        if (foundedYear is < 1800 or > 2100)
        {
            throw Validation("Founded year must be between 1800 and 2100.");
        }

        Sport? sport = null;
        if (sportId.HasValue)
        {
            sport = await _db.Sports.FirstOrDefaultAsync(s => s.Id == sportId.Value, ct);
            if (sport is null)
            {
                throw NotFound($"Sport with id '{sportId.Value}' not found.");
            }
        }

        DomainLocation? location = null;
        if (locationId.HasValue)
        {
            location = await _db.Set<DomainLocation>().FirstOrDefaultAsync(
                l => l.Id == locationId.Value,
                ct
            );
            if (location is null)
            {
                throw NotFound($"Location with id '{locationId.Value}' not found.");
            }
        }

        var finalSlug = BuildSlug(slug, name);
        var exists = await _db.Set<Team>().AnyAsync(t => t.Slug == finalSlug, ct);
        if (exists)
        {
            throw Conflict($"Team slug '{finalSlug}' already exists.");
        }

        var team = new Team
        {
            Name = name.Trim(),
            Slug = finalSlug,
            Description = description,
            IconUrl = iconUrl,
            WebsiteUrl = websiteUrl,
            FoundedYear = new DateTime(foundedYear, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            Sport = sport,
            Location = location
        };

        await _db.Set<Team>().AddAsync(team, ct);
        await _db.SaveChangesAsync(ct);
        return team;
    }

    public async Task<Team> UpdateTeam(
        int id,
        string name,
        int foundedYear,
        string? slug,
        string? description,
        string? iconUrl,
        string? websiteUrl,
        int? sportId,
        int? locationId,
        IReadOnlyList<int>? memberIds,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        if (foundedYear is < 1800 or > 2100)
        {
            throw Validation("Founded year must be between 1800 and 2100.");
        }

        var team = await _db.Set<Team>()
            .Include(t => t.Members)
            .FirstOrDefaultAsync(t => t.Id == id, ct);
        if (team is null)
        {
            throw NotFound($"Team with id '{id}' not found.");
        }

        Sport? sport = null;
        if (sportId.HasValue)
        {
            sport = await _db.Sports.FirstOrDefaultAsync(s => s.Id == sportId.Value, ct);
            if (sport is null)
            {
                throw NotFound($"Sport with id '{sportId.Value}' not found.");
            }
        }

        DomainLocation? location = null;
        if (locationId.HasValue)
        {
            location = await _db.Set<DomainLocation>().FirstOrDefaultAsync(
                l => l.Id == locationId.Value,
                ct
            );
            if (location is null)
            {
                throw NotFound($"Location with id '{locationId.Value}' not found.");
            }
        }

        var finalSlug = BuildSlug(slug, name);
        var exists = await _db.Set<Team>().AnyAsync(t => t.Slug == finalSlug && t.Id != id, ct);
        if (exists)
        {
            throw Conflict($"Team slug '{finalSlug}' already exists.");
        }

        team.Name = name.Trim();
        team.Slug = finalSlug;
        team.Description = description;
        team.IconUrl = iconUrl;
        team.WebsiteUrl = websiteUrl;
        team.FoundedYear = new DateTime(foundedYear, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        team.Sport = sport;
        team.Location = location;

        if (memberIds is not null)
        {
            var distinctMemberIds = memberIds.Distinct().ToList();
            var members = distinctMemberIds.Count == 0
                ? new List<Person>()
                : await _db.Persons.Where(p => distinctMemberIds.Contains(p.Id)).ToListAsync(ct);
            if (members.Count != distinctMemberIds.Count)
            {
                throw NotFound("One or more members were not found.");
            }

            team.Members.Clear();
            foreach (var member in members)
            {
                team.Members.Add(member);
            }
        }

        await _db.SaveChangesAsync(ct);
        return team;
    }

    public async Task<bool> DeleteTeam(int id, CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var team = await _db.Set<Team>().FirstOrDefaultAsync(t => t.Id == id, ct);
        if (team is null)
        {
            return false;
        }

        var participants = await _db.EventParticipants
            .Where(p => p.TeamId == id)
            .ToListAsync(ct);
        foreach (var participant in participants)
        {
            participant.TeamId = null;
        }

        _db.Set<Team>().Remove(team);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<Person> CreatePerson(
        string firstname,
        DateTime birthDate,
        Gender gender,
        PersonalStatus status,
        string? slug,
        string? lastname,
        string? title,
        string? nationality,
        DateTime? deathDate,
        string? biography,
        string? profileImageUrl,
        IReadOnlyList<int>? sportIds,
        IReadOnlyList<int>? teamIds,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var finalSlug = BuildSlug(slug, $"{firstname}-{lastname}".Trim('-'));
        var exists = await _db.Persons.AnyAsync(p => p.Slug == finalSlug, ct);
        if (exists)
        {
            throw Conflict($"Person slug '{finalSlug}' already exists.");
        }

        var person = new Person
        {
            Firstname = firstname.Trim(),
            Lastname = lastname,
            Slug = finalSlug,
            Title = title,
            Nationality = nationality,
            BirthDate = DateTime.SpecifyKind(birthDate, DateTimeKind.Utc),
            DeathDate = deathDate is null
                ? null
                : DateTime.SpecifyKind(deathDate.Value, DateTimeKind.Utc),
            Biography = biography,
            ProfileImageUrl = profileImageUrl,
            Gender = gender,
            Status = status
        };

        if (sportIds is { Count: > 0 })
        {
            var sports = await _db.Sports.Where(s => sportIds.Contains(s.Id)).ToListAsync(ct);
            foreach (var sport in sports)
            {
                person.Sports.Add(sport);
            }
        }

        if (teamIds is { Count: > 0 })
        {
            var teams = await _db.Set<Team>().Where(t => teamIds.Contains(t.Id)).ToListAsync(ct);
            foreach (var team in teams)
            {
                person.Teams.Add(team);
            }
        }

        await _db.Persons.AddAsync(person, ct);
        await _db.SaveChangesAsync(ct);
        return person;
    }

    public async Task<Person> UpdatePerson(
        int id,
        string firstname,
        DateTime birthDate,
        Gender gender,
        PersonalStatus status,
        string? slug,
        string? lastname,
        string? title,
        string? nationality,
        DateTime? deathDate,
        string? biography,
        string? profileImageUrl,
        IReadOnlyList<int>? sportIds,
        IReadOnlyList<int>? teamIds,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var person = await _db.Persons
            .Include(p => p.Sports)
            .Include(p => p.Teams)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
        if (person is null)
        {
            throw NotFound($"Person with id '{id}' not found.");
        }

        var finalSlug = BuildSlug(slug, $"{firstname}-{lastname}".Trim('-'));
        var exists = await _db.Persons.AnyAsync(p => p.Slug == finalSlug && p.Id != id, ct);
        if (exists)
        {
            throw Conflict($"Person slug '{finalSlug}' already exists.");
        }

        person.Firstname = firstname.Trim();
        person.Lastname = lastname;
        person.Slug = finalSlug;
        person.Title = title;
        person.Nationality = nationality;
        person.BirthDate = DateTime.SpecifyKind(birthDate, DateTimeKind.Utc);
        person.DeathDate = deathDate is null
            ? null
            : DateTime.SpecifyKind(deathDate.Value, DateTimeKind.Utc);
        person.Biography = biography;
        person.ProfileImageUrl = profileImageUrl;
        person.Gender = gender;
        person.Status = status;

        if (sportIds is not null)
        {
            var distinctSportIds = sportIds.Distinct().ToList();
            var sports = distinctSportIds.Count == 0
                ? new List<Sport>()
                : await _db.Sports.Where(s => distinctSportIds.Contains(s.Id)).ToListAsync(ct);
            if (sports.Count != distinctSportIds.Count)
            {
                throw NotFound("One or more sports were not found.");
            }

            person.Sports.Clear();
            foreach (var sport in sports)
            {
                person.Sports.Add(sport);
            }
        }

        if (teamIds is not null)
        {
            var distinctTeamIds = teamIds.Distinct().ToList();
            var teams = distinctTeamIds.Count == 0
                ? new List<Team>()
                : await _db.Set<Team>().Where(t => distinctTeamIds.Contains(t.Id)).ToListAsync(ct);
            if (teams.Count != distinctTeamIds.Count)
            {
                throw NotFound("One or more teams were not found.");
            }

            person.Teams.Clear();
            foreach (var team in teams)
            {
                person.Teams.Add(team);
            }
        }

        await _db.SaveChangesAsync(ct);
        return person;
    }

    public async Task<bool> DeletePerson(int id, CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var person = await _db.Persons.FirstOrDefaultAsync(p => p.Id == id, ct);
        if (person is null)
        {
            return false;
        }

        var participants = await _db.EventParticipants
            .Where(p => p.PersonId == id)
            .ToListAsync(ct);
        foreach (var participant in participants)
        {
            participant.PersonId = null;
        }

        _db.Persons.Remove(person);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<SportEvent> CreateSportEvent(
        string title,
        DateTime date,
        int sportId,
        SportEventType type,
        string? fullDescription,
        int? competitionId,
        int? locationId,
        string? mediaUrl,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var sport = await _db.Sports.FirstOrDefaultAsync(s => s.Id == sportId, ct);
        if (sport is null)
        {
            throw NotFound($"Sport with id '{sportId}' not found.");
        }

        if (competitionId.HasValue)
        {
            var competitionExists = await _db.Set<Competition>().AnyAsync(
                c => c.Id == competitionId.Value,
                ct
            );
            if (!competitionExists)
            {
                throw NotFound($"Competition with id '{competitionId.Value}' not found.");
            }
        }

        if (locationId.HasValue)
        {
            var locationExists = await _db.Set<DomainLocation>().AnyAsync(
                l => l.Id == locationId.Value,
                ct
            );
            if (!locationExists)
            {
                throw NotFound($"Location with id '{locationId.Value}' not found.");
            }
        }

        var eventDate = DateTime.SpecifyKind(date, DateTimeKind.Utc);
        var entity = new SportEvent
        {
            Headline = title,
            FullDescription = fullDescription,
            Slug = BuildSlug(null, $"{title}-{eventDate:yyyy-MM-dd}"),
            Year = eventDate.Year,
            Month = eventDate.Month,
            Day = eventDate.Day,
            SportId = sportId,
            Type = type,
            CompetitionId = competitionId,
            LocationId = locationId,
            MediaUrl = mediaUrl
        };

        await _db.SportEvents.AddAsync(entity, ct);
        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<SportEvent> UpdateSportEvent(
        int id,
        string title,
        DateTime date,
        int sportId,
        SportEventType type,
        string? fullDescription,
        int? competitionId,
        int? locationId,
        string? mediaUrl,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var entity = await _db.SportEvents.FirstOrDefaultAsync(e => e.Id == id, ct);
        if (entity is null)
        {
            throw NotFound($"SportEvent with id '{id}' not found.");
        }

        var sport = await _db.Sports.FirstOrDefaultAsync(s => s.Id == sportId, ct);
        if (sport is null)
        {
            throw NotFound($"Sport with id '{sportId}' not found.");
        }

        if (competitionId.HasValue)
        {
            var competitionExists = await _db.Set<Competition>().AnyAsync(
                c => c.Id == competitionId.Value,
                ct
            );
            if (!competitionExists)
            {
                throw NotFound($"Competition with id '{competitionId.Value}' not found.");
            }
        }

        if (locationId.HasValue)
        {
            var locationExists = await _db.Set<DomainLocation>().AnyAsync(
                l => l.Id == locationId.Value,
                ct
            );
            if (!locationExists)
            {
                throw NotFound($"Location with id '{locationId.Value}' not found.");
            }
        }

        var eventDate = DateTime.SpecifyKind(date, DateTimeKind.Utc);
        entity.Headline = title;
        entity.FullDescription = fullDescription;
        entity.Slug = BuildSlug(null, $"{title}-{eventDate:yyyy-MM-dd}");
        entity.Year = eventDate.Year;
        entity.Month = eventDate.Month;
        entity.Day = eventDate.Day;
        entity.SportId = sportId;
        entity.Type = type;
        entity.CompetitionId = competitionId;
        entity.LocationId = locationId;
        entity.MediaUrl = mediaUrl;

        await _db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<EventParticipant> CreateEventParticipant(
        int sportEventId,
        ParticipantRole role,
        int? personId,
        int? teamId,
        string? performanceNote,
        bool isPrimary,
        CancellationToken ct
    )
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        if (!personId.HasValue && !teamId.HasValue)
        {
            throw Validation("At least one of personId or teamId must be provided.");
        }

        var sportEvent = await _db.SportEvents.FirstOrDefaultAsync(e => e.Id == sportEventId, ct);
        if (sportEvent is null)
        {
            throw NotFound($"SportEvent with id '{sportEventId}' not found.");
        }

        if (personId.HasValue)
        {
            var personExists = await _db.Persons.AnyAsync(p => p.Id == personId.Value, ct);
            if (!personExists)
            {
                throw NotFound($"Person with id '{personId.Value}' not found.");
            }
        }

        if (teamId.HasValue)
        {
            var teamExists = await _db.Set<Team>().AnyAsync(t => t.Id == teamId.Value, ct);
            if (!teamExists)
            {
                throw NotFound($"Team with id '{teamId.Value}' not found.");
            }
        }

        var participant = new EventParticipant
        {
            SportEventId = sportEventId,
            SportEvent = sportEvent,
            PersonId = personId,
            TeamId = teamId,
            Role = role,
            PerformanceNote = performanceNote,
            IsPrimary = isPrimary
        };

        await _db.EventParticipants.AddAsync(participant, ct);
        await _db.SaveChangesAsync(ct);
        return participant;
    }

    public async Task<bool> DeleteSportEvent(int id, CancellationToken ct)
    {
        using var scope = _scopeFactory.CreateScope();
        var _db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
        var authenticationService = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        await EnsureAdminAsync(httpContextAccessor, authenticationService);

        var entity = await _db.SportEvents.FirstOrDefaultAsync(e => e.Id == id, ct);
        if (entity is null)
        {
            return false;
        }

        _db.SportEvents.Remove(entity);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    private static string BuildSlug(string? explicitSlug, string fallbackSource)
    {
        var raw = string.IsNullOrWhiteSpace(explicitSlug) ? fallbackSource : explicitSlug;
        var generated = SlugGenerator.Generate(raw.Trim());
        return generated.Replace(' ', '-');
    }

    private static async Task EnsureAdminAsync(
        IHttpContextAccessor httpContextAccessor,
        IAuthenticationService authenticationService
    )
    {
        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext is null)
        {
            throw Unauthorized("Admin authentication is required.");
        }

        var authResult = await authenticationService.AuthenticateAsync(
            httpContext,
            JwtBearerDefaults.AuthenticationScheme
        );

        var user = authResult.Principal;
        if (!authResult.Succeeded || user is null || !user.IsInRole("Admin"))
        {
            throw Unauthorized("Admin authentication is required.");
        }
    }

    private static GraphQLException Unauthorized(string message)
        => new(
            ErrorBuilder.New()
                .SetCode("UNAUTHORIZED")
                .SetMessage(message)
                .Build()
        );

    private static GraphQLException NotFound(string message)
        => new(
            ErrorBuilder.New()
                .SetCode("NOT_FOUND")
                .SetMessage(message)
                .Build()
        );

    private static GraphQLException Conflict(string message)
        => new(
            ErrorBuilder.New()
                .SetCode("CONFLICT")
                .SetMessage(message)
                .Build()
        );

    private static GraphQLException Validation(string message)
        => new(
            ErrorBuilder.New()
                .SetCode("VALIDATION_ERROR")
                .SetMessage(message)
                .Build()
        );
}
