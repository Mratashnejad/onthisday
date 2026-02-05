using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace OnThisDay.Api.Infrastructure.Data;

public sealed class OnThisDayDbContextFactory
    : IDesignTimeDbContextFactory<OnThisDayDbContext>
{
    public OnThisDayDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("DATABASE_URL");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Missing DATABASE_URL for EF Core design-time operations."
            );
        }

        var options = new DbContextOptionsBuilder<OnThisDayDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new OnThisDayDbContext(options);
    }
}