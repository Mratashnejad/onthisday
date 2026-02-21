using HotChocolate;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using OnThisDay.Api.Application.Services;
using OnThisDay.Api.Domain.Entities;
using OnThisDay.Api.Domain.Repositories;
using OnThisDay.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using DomainLocation = OnThisDay.Api.Domain.Entities.Location;

namespace OnThisDay.Api.Presentation.Web.Resolvers;

public sealed class SportEventQuery
{
    public Task<IEnumerable<SportEvent>> GetSportEvents(
        int day,
        int month,
        string? sportSlug,
        [Service] ISportEventService service,
        CancellationToken ct
    )
    {
        if (day is < 1 or > 31)
        {
            throw new GraphQLException(
                ErrorBuilder.New()
                    .SetCode("INVALID_DAY")
                    .SetMessage("Day must be between 1 and 31.")
                    .Build()
            );
        }

        if (month is < 1 or > 12)
        {
            throw new GraphQLException(
                ErrorBuilder.New()
                    .SetCode("INVALID_MONTH")
                    .SetMessage("Month must be between 1 and 12.")
                    .Build()
            );
        }

        return service.GetByDateAsync(day, month, sportSlug, ct);
    }

    public Task<SportEvent?> GetSportEvent(int id, [Service] ISportEventService service)
        => service.GetByIdAsync(id);

    public Task<IEnumerable<Sport>> GetSports([Service] ISportRepository sportRepository)
        => sportRepository.GetAllAsync();

    public async Task<List<Person>> GetPersons(
        PersonalStatus? status,
        [Service] OnThisDayDbContext db,
        CancellationToken ct
    )
    {
        var query = db.Persons
            .AsNoTracking()
            .Include(p => p.Sports)
            .Include(p => p.Teams)
            .AsQueryable();

        if (status is not null)
        {
            query = query.Where(p => p.Status == status.Value);
        }

        return await query
            .OrderBy(p => p.Firstname)
            .ThenBy(p => p.Lastname)
            .ToListAsync(ct);
    }

    public Task<List<Sport>> GetAdminSports(
        [Service] OnThisDayDbContext db,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IAuthenticationService authenticationService,
        CancellationToken ct
    )
        => GetAdminSportsCore(db, httpContextAccessor, authenticationService, ct);

    public Task<List<DomainLocation>> GetAdminLocations(
        [Service] OnThisDayDbContext db,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IAuthenticationService authenticationService,
        CancellationToken ct
    )
        => GetAdminLocationsCore(db, httpContextAccessor, authenticationService, ct);

    public Task<List<Competition>> GetAdminCompetitions(
        [Service] OnThisDayDbContext db,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IAuthenticationService authenticationService,
        CancellationToken ct
    )
        => GetAdminCompetitionsCore(db, httpContextAccessor, authenticationService, ct);

    public Task<List<Team>> GetAdminTeams(
        [Service] OnThisDayDbContext db,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IAuthenticationService authenticationService,
        CancellationToken ct
    )
        => GetAdminTeamsCore(db, httpContextAccessor, authenticationService, ct);

    public Task<List<Person>> GetAdminPersons(
        [Service] OnThisDayDbContext db,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IAuthenticationService authenticationService,
        CancellationToken ct
    )
        => GetAdminPersonsCore(db, httpContextAccessor, authenticationService, ct);

    public Task<List<SportEvent>> GetAdminSportEvents(
        [Service] OnThisDayDbContext db,
        [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IAuthenticationService authenticationService,
        CancellationToken ct
    )
        => GetAdminSportEventsCore(db, httpContextAccessor, authenticationService, ct);

    private static async Task<List<Sport>> GetAdminSportsCore(
        OnThisDayDbContext db,
        IHttpContextAccessor httpContextAccessor,
        IAuthenticationService authenticationService,
        CancellationToken ct
    )
    {
        await EnsureAdminAsync(httpContextAccessor, authenticationService);
        return await db.Sports.AsNoTracking().OrderBy(s => s.Name).ToListAsync(ct);
    }

    private static async Task<List<DomainLocation>> GetAdminLocationsCore(
        OnThisDayDbContext db,
        IHttpContextAccessor httpContextAccessor,
        IAuthenticationService authenticationService,
        CancellationToken ct
    )
    {
        await EnsureAdminAsync(httpContextAccessor, authenticationService);
        return await db.Set<DomainLocation>().AsNoTracking().OrderBy(l => l.Name).ToListAsync(ct);
    }

    private static async Task<List<Competition>> GetAdminCompetitionsCore(
        OnThisDayDbContext db,
        IHttpContextAccessor httpContextAccessor,
        IAuthenticationService authenticationService,
        CancellationToken ct
    )
    {
        await EnsureAdminAsync(httpContextAccessor, authenticationService);
        return await db.Set<Competition>()
            .AsNoTracking()
            .Include(c => c.Sport)
            .OrderBy(c => c.Name)
            .ToListAsync(ct);
    }

    private static async Task<List<Team>> GetAdminTeamsCore(
        OnThisDayDbContext db,
        IHttpContextAccessor httpContextAccessor,
        IAuthenticationService authenticationService,
        CancellationToken ct
    )
    {
        await EnsureAdminAsync(httpContextAccessor, authenticationService);
        return await db.Set<Team>()
            .AsNoTracking()
            .Include(t => t.Sport)
            .Include(t => t.Location)
            .OrderBy(t => t.Name)
            .ToListAsync(ct);
    }

    private static async Task<List<Person>> GetAdminPersonsCore(
        OnThisDayDbContext db,
        IHttpContextAccessor httpContextAccessor,
        IAuthenticationService authenticationService,
        CancellationToken ct
    )
    {
        await EnsureAdminAsync(httpContextAccessor, authenticationService);
        return await db.Persons
            .AsNoTracking()
            .Include(p => p.Sports)
            .Include(p => p.Teams)
            .OrderBy(p => p.Firstname)
            .ToListAsync(ct);
    }

    private static async Task<List<SportEvent>> GetAdminSportEventsCore(
        OnThisDayDbContext db,
        IHttpContextAccessor httpContextAccessor,
        IAuthenticationService authenticationService,
        CancellationToken ct
    )
    {
        await EnsureAdminAsync(httpContextAccessor, authenticationService);
        return await db.SportEvents
            .AsNoTracking()
            .Include(e => e.Sport)
            .Include(e => e.Competition)
            .Include(e => e.Location)
            .OrderByDescending(e => e.Year)
            .ThenByDescending(e => e.Month)
            .ThenByDescending(e => e.Day)
            .ToListAsync(ct);
    }

    private static async Task EnsureAdminAsync(
        IHttpContextAccessor httpContextAccessor,
        IAuthenticationService authenticationService
    )
    {
        var httpContext = httpContextAccessor.HttpContext;
        if (httpContext is null)
        {
            throw new GraphQLException(
                ErrorBuilder.New()
                    .SetCode("UNAUTHORIZED")
                    .SetMessage("Admin authentication is required.")
                    .Build()
            );
        }

        var authResult = await authenticationService.AuthenticateAsync(
            httpContext,
            JwtBearerDefaults.AuthenticationScheme
        );

        var user = authResult.Principal;
        if (!authResult.Succeeded || user is null || !user.IsInRole("Admin"))
        {
            throw new GraphQLException(
                ErrorBuilder.New()
                    .SetCode("UNAUTHORIZED")
                    .SetMessage("Admin authentication is required.")
                    .Build()
            );
        }
    }
}
