using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnThisDay.Api.Domain.Entities;


namespace OnThisDay.Api.Infrastructure.Data.Configurations;

public sealed class PersonConfiguration : IEntityTypeConfiguration<Person>
{
    
    public void Configure(EntityTypeBuilder<Person> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Firstname)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Lastname)
            .HasMaxLength(100);

        builder.Property(p => p.Slug)
            .IsRequired()
            .HasMaxLength(250);
        
        builder.HasIndex(p=> p.Slug)
             .IsUnique();

        builder.Property(p => p.Title)
            .HasMaxLength(150);
        
        builder.Property(p => p.Biography)
            .HasMaxLength(5000);

        builder.Property(p => p.Gender)
            .IsRequired();

        builder.Property(p=> p.Status)
            .IsRequired();

  
        builder.Property(p => p.Nationality)
            .HasMaxLength(100);

    }
}