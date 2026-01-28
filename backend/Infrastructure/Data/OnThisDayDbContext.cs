using Microsoft.EntityFrameworkCore;
using OnThisDay.Api.Domain.Entities;

namespace OnThisDay.Api.Infrastructure.Data;

public sealed class OnThisDayDbContext : DbContext
{
    public OnThisDayDbContext(DbContextOptions<OnThisDayDbContext> options) : base(options)
    {
    }

    public DbSet<Sport> Sports => Set<Sport>();
    public DbSet<SportEvent> SportEvents => Set<SportEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Sport>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.HasIndex(s => s.Slug).IsUnique();
            entity.Property(s => s.Name).IsRequired();
            entity.Property(s => s.Slug).IsRequired();
            entity.Property(s => s.IsActive).HasDefaultValue(true);
            entity.HasMany(s => s.Events)
                .WithOne(e => e.Sport)
                .HasForeignKey(e => e.SportId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SportEvent>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.Day, e.Month });
            entity.HasIndex(e => e.SportId);
            entity.Property(e => e.Title).IsRequired();
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Importance).HasDefaultValue(1);
        });
    }
}
