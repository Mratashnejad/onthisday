using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnThisDay.Api.Domain.Entities;


namespace OnThisDay.Api.Infrastructure.Data.Configurations;


public sealed class SportConfiguration : IEntityTypeConfiguration<Sport>
{
    public void Configure(EntityTypeBuilder<Sport> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.Slug)
            .IsRequired()
            .HasMaxLength(120);

        builder.Property(s => s.Description)
            .HasMaxLength(1000);

        builder.Property(s => s.IconUrl)
            .HasMaxLength(500);

        builder.HasIndex(s => s.Slug)
            .IsUnique();
    }
}
