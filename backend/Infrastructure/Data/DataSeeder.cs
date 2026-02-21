using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OnThisDay.Api.Domain.Entities;
using DomainLocation = OnThisDay.Api.Domain.Entities.Location;

namespace OnThisDay.Api.Infrastructure.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider services, CancellationToken ct = default)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<OnThisDayDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        await db.Database.MigrateAsync(ct);

        await SeedAdminUserAsync(userManager);
        await SeedSportsDataAsync(db, ct);
        await SeedPersianBulkContentAsync(db, ct);
    }

    private static async Task SeedAdminUserAsync(UserManager<User> userManager)
    {
        const string adminUserName = "admin";
        const string adminEmail = "admin@onthisday.local";
        const string adminPassword = "Admin@12345";

        var existing = await userManager.FindByNameAsync(adminUserName);
        if (existing is not null)
        {
            return;
        }

        var user = new User
        {
            UserName = adminUserName,
            Email = adminEmail,
            EmailConfirmed = true,
            FirstName = "Site",
            LastName = "Admin",
            IsActive = true
        };

        var result = await userManager.CreateAsync(user, adminPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Failed to seed admin user: {errors}");
        }
    }

    private static async Task SeedSportsDataAsync(OnThisDayDbContext db, CancellationToken ct)
    {
        if (await db.SportEvents.AnyAsync(ct))
        {
            return;
        }

        var football = new Sport
        {
            Name = "Football",
            Slug = "football",
            Description = "Global football events and milestones.",
            Type = SportType.Team
        };
        var iceHockey = new Sport
        {
            Name = "Ice Hockey",
            Slug = "ice-hockey",
            Description = "Historic ice hockey events.",
            Type = SportType.Team
        };
        var figureSkating = new Sport
        {
            Name = "Figure Skating",
            Slug = "figure-skating",
            Description = "Historic figure skating records and achievements.",
            Type = SportType.Individual
        };
        var baseball = new Sport
        {
            Name = "Baseball",
            Slug = "baseball",
            Description = "Notable baseball history events.",
            Type = SportType.Team
        };

        await db.Sports.AddRangeAsync([football, iceHockey, figureSkating, baseball], ct);
        await db.SaveChangesAsync(ct);

        var stMoritz = new DomainLocation
        {
            Name = "St. Moritz Olympic Arena",
            Slug = "st-moritz",
            City = "St. Moritz",
            Country = "Switzerland"
        };
        var newYork = new DomainLocation
        {
            Name = "Yankee Stadium",
            Slug = "yankee-stadium",
            City = "New York",
            Country = "United States"
        };

        await db.Set<DomainLocation>().AddRangeAsync([stMoritz, newYork], ct);
        await db.SaveChangesAsync(ct);

        var winterOlympics = new Competition
        {
            Name = "Winter Olympic Games",
            ShortName = "Winter Olympics",
            Slug = "winter-olympics",
            Level = CompetitionLevel.International,
            SportId = iceHockey.Id
        };
        var mlb = new Competition
        {
            Name = "Major League Baseball",
            ShortName = "MLB",
            Slug = "mlb",
            Level = CompetitionLevel.National,
            SportId = baseball.Id
        };

        await db.Set<Competition>().AddRangeAsync([winterOlympics, mlb], ct);
        await db.SaveChangesAsync(ct);

        var canada = new Team
        {
            Name = "Canada Olympic Team",
            Slug = "canada-olympic-team",
            Sport = iceHockey,
            Location = stMoritz,
            FoundedYear = new DateTime(1900, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };
        var switzerland = new Team
        {
            Name = "Switzerland Olympic Team",
            Slug = "switzerland-olympic-team",
            Sport = iceHockey,
            Location = stMoritz,
            FoundedYear = new DateTime(1900, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };
        var yankees = new Team
        {
            Name = "New York Yankees",
            Slug = "new-york-yankees",
            Sport = baseball,
            Location = newYork,
            FoundedYear = new DateTime(1901, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        await db.Set<Team>().AddRangeAsync([canada, switzerland, yankees], ct);
        await db.SaveChangesAsync(ct);

        var daveTrottier = new Person
        {
            Firstname = "Dave",
            Lastname = "Trottier",
            Slug = "dave-trottier",
            Nationality = "Canada",
            BirthDate = new DateTime(1906, 7, 25, 0, 0, 0, DateTimeKind.Utc),
            Gender = Gender.Male,
            Status = PersonalStatus.Deceased
        };
        var gillis = new Person
        {
            Firstname = "Gillis",
            Lastname = "Grafstrom",
            Slug = "gillis-grafstrom",
            Nationality = "Sweden",
            BirthDate = new DateTime(1893, 6, 7, 0, 0, 0, DateTimeKind.Utc),
            Gender = Gender.Male,
            Status = PersonalStatus.Deceased
        };

        await db.Persons.AddRangeAsync([daveTrottier, gillis], ct);
        await db.SaveChangesAsync(ct);

        var seededEvents = new[]
        {
            new SportEvent
            {
                Headline = "Canada retains Olympic ice hockey title by routing Switzerland 13-0 in St. Moritz.",
                FullDescription = "Canadian left wing Dave Trottier tops scoring with 15 points in the final round.",
                Slug = "canada-retains-olympic-ice-hockey-title-1928",
                Year = 1928,
                Month = 2,
                Day = 19,
                Type = SportEventType.MatchResult,
                SportId = iceHockey.Id,
                CompetitionId = winterOlympics.Id,
                LocationId = stMoritz.Id
            },
            new SportEvent
            {
                Headline = "Gillis Grafstrom wins his 3rd consecutive Olympic men’s figure skating gold medal.",
                FullDescription = "Won only the second athlete to win gold in both Summer and Winter Olympic Games.",
                Slug = "gillis-grafstrom-third-olympic-gold-1928",
                Year = 1928,
                Month = 2,
                Day = 19,
                Type = SportEventType.Achievement,
                SportId = figureSkating.Id,
                CompetitionId = winterOlympics.Id,
                LocationId = stMoritz.Id
            },
            new SportEvent
            {
                Headline = "II Winter Olympic Games close at St. Moritz, Switzerland.",
                Slug = "winter-olympics-close-st-moritz-1928",
                Year = 1928,
                Month = 2,
                Day = 19,
                Type = SportEventType.Other,
                SportId = iceHockey.Id,
                CompetitionId = winterOlympics.Id,
                LocationId = stMoritz.Id
            },
            new SportEvent
            {
                Headline = "New York Yankees announce 5,000 uniformed soldiers admitted free to upcoming home games.",
                Slug = "yankees-admit-soldiers-free-1942",
                Year = 1942,
                Month = 2,
                Day = 19,
                Type = SportEventType.Other,
                SportId = baseball.Id,
                CompetitionId = mlb.Id,
                LocationId = newYork.Id
            }
        };

        await db.SportEvents.AddRangeAsync(seededEvents, ct);
        await db.SaveChangesAsync(ct);

        await db.EventParticipants.AddRangeAsync(
            [
                new EventParticipant
                {
                    SportEventId = seededEvents[0].Id,
                    TeamId = canada.Id,
                    Role = ParticipantRole.Winner,
                    IsPrimary = true,
                    SportEvent = seededEvents[0]
                },
                new EventParticipant
                {
                    SportEventId = seededEvents[0].Id,
                    TeamId = switzerland.Id,
                    Role = ParticipantRole.Loser,
                    SportEvent = seededEvents[0]
                },
                new EventParticipant
                {
                    SportEventId = seededEvents[0].Id,
                    PersonId = daveTrottier.Id,
                    Role = ParticipantRole.Scorer,
                    PerformanceNote = "15 points",
                    SportEvent = seededEvents[0]
                },
                new EventParticipant
                {
                    SportEventId = seededEvents[1].Id,
                    PersonId = gillis.Id,
                    Role = ParticipantRole.RecordBreaker,
                    IsPrimary = true,
                    SportEvent = seededEvents[1]
                }
            ],
            ct
        );

        await db.SaveChangesAsync(ct);
    }

    private static async Task SeedPersianBulkContentAsync(OnThisDayDbContext db, CancellationToken ct)
    {
        var sports = await EnsurePersianSportsAsync(db, ct);
        var persons = await SeedPersianPersonsAsync(db, sports, ct);
        await SeedPersianEventsAsync(db, sports, persons, ct);
        await SeedBirthdayDeathExtrasAsync(db, sports, persons, ct);
    }

    private static async Task<List<Sport>> EnsurePersianSportsAsync(
        OnThisDayDbContext db,
        CancellationToken ct
    )
    {
        var definitions = new[]
        {
            new
            {
                Name = "فوتبال",
                Slug = "fa-football",
                Type = SportType.Team,
                Description = "رویدادها و لحظات تاریخی فوتبال جهان."
            },
            new
            {
                Name = "بسکتبال",
                Slug = "fa-basketball",
                Type = SportType.Team,
                Description = "روایت‌های مهم از رقابت‌های بسکتبال."
            },
            new
            {
                Name = "والیبال",
                Slug = "fa-volleyball",
                Type = SportType.Team,
                Description = "اتفاقات مهم والیبال ملی و باشگاهی."
            },
            new
            {
                Name = "کشتی",
                Slug = "fa-wrestling",
                Type = SportType.Combat,
                Description = "تاریخ افتخارات و رقابت‌های کشتی."
            },
            new
            {
                Name = "تکواندو",
                Slug = "fa-taekwondo",
                Type = SportType.Combat,
                Description = "رویدادهای برجسته تکواندو در جهان."
            },
            new
            {
                Name = "وزنه‌برداری",
                Slug = "fa-weightlifting",
                Type = SportType.Olympic,
                Description = "رکوردها و افتخارات وزنه‌برداری."
            },
            new
            {
                Name = "شنا",
                Slug = "fa-swimming",
                Type = SportType.Olympic,
                Description = "لحظات تاریخی رقابت‌های شنا."
            },
            new
            {
                Name = "تنیس",
                Slug = "fa-tennis",
                Type = SportType.Individual,
                Description = "رویدادهای مهم گرند اسلم و ATP/WTA."
            },
            new
            {
                Name = "دوومیدانی",
                Slug = "fa-athletics",
                Type = SportType.Olympic,
                Description = "رکوردها و تاریخ دوومیدانی جهان."
            },
            new
            {
                Name = "فوتسال",
                Slug = "fa-futsal",
                Type = SportType.Team,
                Description = "اتفاقات مهم فوتسال در تورنمنت‌های ملی."
            }
        };

        var slugs = definitions.Select(d => d.Slug).ToArray();
        var existing = await db.Sports.Where(s => slugs.Contains(s.Slug)).ToDictionaryAsync(s => s.Slug, ct);
        var toCreate = new List<Sport>();

        foreach (var definition in definitions)
        {
            if (existing.ContainsKey(definition.Slug))
            {
                continue;
            }

            toCreate.Add(
                new Sport
                {
                    Name = definition.Name,
                    Slug = definition.Slug,
                    Type = definition.Type,
                    Description = definition.Description,
                    IconUrl = $"https://picsum.photos/seed/{definition.Slug}/256/256"
                }
            );
        }

        if (toCreate.Count > 0)
        {
            await db.Sports.AddRangeAsync(toCreate, ct);
            await db.SaveChangesAsync(ct);
        }

        return await db.Sports.Where(s => slugs.Contains(s.Slug)).OrderBy(s => s.Id).ToListAsync(ct);
    }

    private static async Task<List<Person>> SeedPersianPersonsAsync(
        OnThisDayDbContext db,
        IReadOnlyList<Sport> sports,
        CancellationToken ct
    )
    {
        var firstNames = new[]
        {
            "امیر",
            "محمد",
            "علی",
            "رضا",
            "کیان",
            "نیما",
            "آرمان",
            "پرهام",
            "یاسین",
            "مهدی",
            "سارا",
            "زهرا",
            "نگار",
            "نازنین",
            "مهسا",
            "ریحانه",
            "الناز",
            "هستی",
            "مریم",
            "پریسا"
        };
        var lastNames = new[]
        {
            "کریمی",
            "سلیمانی",
            "حیدری",
            "نوری",
            "مرادی",
            "احمدی",
            "شریفی",
            "کاظمی",
            "رضایی",
            "عباسی",
            "حسینی",
            "یزدانی",
            "میرزایی",
            "جلالی",
            "مختاری"
        };

        var existingSlugs = await db.Persons
            .Where(p => p.Slug.StartsWith("fa-person-"))
            .Select(p => p.Slug)
            .ToHashSetAsync(ct);

        var toCreate = new List<Person>();
        for (var i = 1; i <= 50; i++)
        {
            var slug = $"fa-person-{i:000}";
            if (existingSlugs.Contains(slug))
            {
                continue;
            }

            var sport = sports[(i - 1) % sports.Count];
            var birthYear = 1948 + (i % 44);
            var month = ((i - 1) % 12) + 1;
            var day = ((i * 2 - 1) % 28) + 1;
            var birthDate = new DateTime(birthYear, month, day, 0, 0, 0, DateTimeKind.Utc);

            var deceased = i % 4 == 0;
            var deathYear = Math.Min(birthYear + 48 + (i % 17), 2025);
            DateTime? deathDate = deceased
                ? new DateTime(deathYear, month, ((day + 5 - 1) % 28) + 1, 0, 0, 0, DateTimeKind.Utc)
                : null;

            var status = deceased
                ? PersonalStatus.Deceased
                : i % 3 == 0
                    ? PersonalStatus.Retired
                    : PersonalStatus.Active;

            var firstname = firstNames[(i - 1) % firstNames.Length];
            var lastname = lastNames[(i * 3 - 1) % lastNames.Length];
            var fullName = $"{firstname} {lastname}";
            var title = i % 5 == 0 ? "قهرمان ملی" : i % 2 == 0 ? "ستاره لیگ" : "اسطوره ورزشی";

            toCreate.Add(
                new Person
                {
                    Firstname = firstname,
                    Lastname = lastname,
                    Slug = slug,
                    Title = title,
                    Nationality = i % 2 == 0 ? "ایران" : "بین‌المللی",
                    BirthDate = birthDate,
                    DeathDate = deathDate,
                    Biography =
                        $"{fullName} یکی از چهره‌های شناخته‌شده ورزش {sport.Name} است و در رویدادهای مهم ملی و بین‌المللی حضور داشته است.",
                    ProfileImageUrl = $"https://picsum.photos/seed/{slug}/640/640",
                    Gender = i % 2 == 0 ? Gender.Male : Gender.Female,
                    Status = status,
                    Sports = [sport]
                }
            );
        }

        if (toCreate.Count > 0)
        {
            await db.Persons.AddRangeAsync(toCreate, ct);
            await db.SaveChangesAsync(ct);
        }

        return await db.Persons
            .Include(p => p.Sports)
            .Where(p => p.Slug.StartsWith("fa-person-"))
            .OrderBy(p => p.Slug)
            .Take(50)
            .ToListAsync(ct);
    }

    private static async Task SeedPersianEventsAsync(
        OnThisDayDbContext db,
        IReadOnlyList<Sport> sports,
        IReadOnlyList<Person> persons,
        CancellationToken ct
    )
    {
        var topicPool = new[]
        {
            "قهرمانی تاریخی",
            "رکورد امتیاز",
            "بازگشت تماشایی",
            "انتقال بزرگ",
            "فینال دراماتیک",
            "شروع نسل طلایی",
            "پیروزی غیرمنتظره",
            "ثبت رکورد ملی",
            "نبرد کلاسیک",
            "افتخار قاره‌ای"
        };
        var eventTypes = new[]
        {
            SportEventType.MatchResult,
            SportEventType.Achievement,
            SportEventType.WorldRecord,
            SportEventType.Transfer,
            SportEventType.Retirement,
            SportEventType.Other
        };

        var existingSlugs = await db.SportEvents
            .Where(
                e =>
                    e.Slug.StartsWith("fa-event-")
                    || e.Slug.StartsWith("fa-birthday-")
                    || e.Slug.StartsWith("fa-death-")
            )
            .Select(e => e.Slug)
            .ToHashSetAsync(ct);

        var toCreate = new List<SportEvent>();

        for (var i = 1; i <= 50; i++)
        {
            var slug = $"fa-event-{i:000}";
            if (!existingSlugs.Contains(slug))
            {
                var sport = sports[(i - 1) % sports.Count];
                var topic = topicPool[(i - 1) % topicPool.Length];
                var month = ((i + 2 - 1) % 12) + 1;
                var day = ((i * 3 - 1) % 28) + 1;
                var year = 1965 + i;

                toCreate.Add(
                    new SportEvent
                    {
                        Headline = $"ثبت «{topic}» در تاریخ {sport.Name}",
                        FullDescription =
                            $"در این روز، رویداد مهم «{topic}» در رشته {sport.Name} ثبت شد و بازتاب گسترده‌ای در رسانه‌های ورزشی داشت.",
                        Slug = slug,
                        Year = year,
                        Month = month,
                        Day = day,
                        Type = eventTypes[(i - 1) % eventTypes.Length],
                        SportId = sport.Id,
                        MediaUrl = $"https://picsum.photos/seed/{slug}/1280/720"
                    }
                );
            }
        }

        for (var i = 1; i <= 50; i++)
        {
            var slug = $"fa-birthday-{i:000}";
            if (!existingSlugs.Contains(slug))
            {
                var person = persons[(i - 1) % persons.Count];
                var sport = person.Sports.FirstOrDefault() ?? sports[(i - 1) % sports.Count];
                var fullName = $"{person.Firstname} {person.Lastname}".Trim();

                toCreate.Add(
                    new SportEvent
                    {
                        Headline = $"زادروز {fullName}",
                        FullDescription =
                            $"امروز سالروز تولد {fullName}، از چهره‌های تاثیرگذار {sport.Name} است که در دوران حرفه‌ای خود افتخارات متعددی کسب کرده است.",
                        Slug = slug,
                        Year = person.BirthDate.Year,
                        Month = person.BirthDate.Month,
                        Day = person.BirthDate.Day,
                        Type = SportEventType.Other,
                        SportId = sport.Id,
                        MediaUrl = $"https://picsum.photos/seed/{slug}/1280/720"
                    }
                );
            }
        }

        for (var i = 1; i <= 50; i++)
        {
            var slug = $"fa-death-{i:000}";
            if (!existingSlugs.Contains(slug))
            {
                var person = persons[(i - 1) % persons.Count];
                var sport = person.Sports.FirstOrDefault() ?? sports[(i - 1) % sports.Count];
                var fullName = $"{person.Firstname} {person.Lastname}".Trim();
                var referenceDate =
                    person.DeathDate
                    ?? new DateTime(
                        Math.Min(person.BirthDate.Year + 62 + (i % 9), 2025),
                        person.BirthDate.Month,
                        ((person.BirthDate.Day + 9 - 1) % 28) + 1,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc
                    );

                toCreate.Add(
                    new SportEvent
                    {
                        Headline = $"سالروز درگذشت {fullName}",
                        FullDescription =
                            $"در این روز یاد و خاطره {fullName} گرامی داشته می‌شود؛ شخصیتی ماندگار در تاریخ {sport.Name}.",
                        Slug = slug,
                        Year = referenceDate.Year,
                        Month = referenceDate.Month,
                        Day = referenceDate.Day,
                        Type = SportEventType.Other,
                        SportId = sport.Id,
                        MediaUrl = $"https://picsum.photos/seed/{slug}/1280/720"
                    }
                );
            }
        }

        if (toCreate.Count > 0)
        {
            await db.SportEvents.AddRangeAsync(toCreate, ct);
            await db.SaveChangesAsync(ct);
        }
    }

    private static async Task SeedBirthdayDeathExtrasAsync(
        OnThisDayDbContext db,
        IReadOnlyList<Sport> sports,
        IReadOnlyList<Person> persons,
        CancellationToken ct
    )
    {
        var existing = await db.SportEvents
            .Where(e => e.Slug.StartsWith("fa-birthday-plus-") || e.Slug.StartsWith("fa-death-plus-"))
            .Select(e => e.Slug)
            .ToHashSetAsync(ct);

        var toCreate = new List<SportEvent>();

        for (var i = 1; i <= 20; i++)
        {
            var birthdaySlug = $"fa-birthday-plus-{i:000}";
            if (!existing.Contains(birthdaySlug))
            {
                var person = persons[(i * 2 - 1) % persons.Count];
                var sport = person.Sports.FirstOrDefault() ?? sports[(i - 1) % sports.Count];
                var name = $"{person.Firstname} {person.Lastname}".Trim();
                var day = ((18 + i - 1) % 28) + 1;

                toCreate.Add(
                    new SportEvent
                    {
                        Headline = $"تولد {name}",
                        FullDescription = $"زادروز {name} از چهره‌های شناخته‌شده {sport.Name}.",
                        Slug = birthdaySlug,
                        Year = person.BirthDate.Year,
                        Month = 2,
                        Day = day,
                        Type = SportEventType.Other,
                        SportId = sport.Id,
                        MediaUrl = $"https://picsum.photos/seed/{birthdaySlug}/1280/720"
                    }
                );
            }

            var deathSlug = $"fa-death-plus-{i:000}";
            if (!existing.Contains(deathSlug))
            {
                var person = persons[(i * 3 - 1) % persons.Count];
                var sport = person.Sports.FirstOrDefault() ?? sports[(i - 1) % sports.Count];
                var name = $"{person.Firstname} {person.Lastname}".Trim();
                var referenceDate =
                    person.DeathDate
                    ?? new DateTime(
                        Math.Min(person.BirthDate.Year + 60 + (i % 8), 2025),
                        2,
                        ((20 + i - 1) % 28) + 1,
                        0,
                        0,
                        0,
                        DateTimeKind.Utc
                    );

                toCreate.Add(
                    new SportEvent
                    {
                        Headline = $"درگذشت {name}",
                        FullDescription = $"یادبود {name}، از نام‌های ماندگار در {sport.Name}.",
                        Slug = deathSlug,
                        Year = referenceDate.Year,
                        Month = referenceDate.Month,
                        Day = referenceDate.Day,
                        Type = SportEventType.Other,
                        SportId = sport.Id,
                        MediaUrl = $"https://picsum.photos/seed/{deathSlug}/1280/720"
                    }
                );
            }
        }

        if (toCreate.Count > 0)
        {
            await db.SportEvents.AddRangeAsync(toCreate, ct);
            await db.SaveChangesAsync(ct);
        }
    }
}
