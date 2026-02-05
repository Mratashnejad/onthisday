using Microsoft.EntityFrameworkCore;
using OnThisDay.Api.Domain.Entities;


namespace OnThisDay.Api.Infrastructure.Data;

public sealed class OnThisDayDbContext : DbContext
{
    public OnThisDayDbContext(DbContextOptions<OnThisDayDbContext> Options) : base(Options)
    { }
    public DbSet<Sport> Sports => Set<Sport>();
    public DbSet<Competition> Competitions => Set<Competition>();
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<Person> Persons => Set<Person>();
    public DbSet<SportEvent> SportEvents => Set<SportEvent>();
    public DbSet<EventParticipant> EventParticipants => Set<EventParticipant>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Sport>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(100);
        });


    }
}
