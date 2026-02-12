using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

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
            var environment =
                Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
                ?? "Development";

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            connectionString =
                configuration.GetConnectionString("OnThisDayDb");
        }

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Missing DATABASE_URL or ConnectionStrings:OnThisDayDb."
            );
        }

        var options = new DbContextOptionsBuilder<OnThisDayDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new OnThisDayDbContext(options);
    }
}
