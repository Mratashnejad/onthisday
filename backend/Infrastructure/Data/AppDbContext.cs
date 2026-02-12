using Microsoft.EntityFrameworkCore;
using OnThisDay.Api.Domain.Entities;
using OnThisDay.Api.Infrastructure.Data.Conventions;


namespace OnThisDay.Api.Infrastructure.Data;
public sealed class OnThisDayDbContext : DbContext
{
    public OnThisDayDbContext(DbContextOptions<OnThisDayDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Sport> Sports => Set<Sport>();
    public DbSet<Competition> Competitions => Set<Competition>();
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<Person> Persons => Set<Person>();
    public DbSet<SportEvent> SportEvents => Set<SportEvent>();
    public DbSet<EventParticipant> EventParticipants => Set<EventParticipant>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1️⃣ naming convention (snake_case)
        SnakeCaseNamingConvention.Apply(modelBuilder);

        // 2️⃣ load all IEntityTypeConfiguration<T>
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(OnThisDayDbContext).Assembly
        );
    }
}