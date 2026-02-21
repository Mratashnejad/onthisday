using Microsoft.EntityFrameworkCore;
using OnThisDay.Api.Domain.Entities;
using OnThisDay.Api.Domain.Repositories;
using OnThisDay.Api.Infrastructure.Data;

namespace OnThisDay.Api.Infrastructure.Repositories;

public sealed class SportEventRepository : ISportEventRepository
{
    private readonly OnThisDayDbContext _db;

    public SportEventRepository(OnThisDayDbContext db)
    {
        _db = db;
    }

    // ===== IGenericRepository =====

    public async Task<IEnumerable<SportEvent>> GetAllAsync()
        => await _db.SportEvents
            .AsNoTracking()
            .Include(e => e.Sport)
            .OrderBy(e => e.Month)
            .ThenBy(e => e.Day)
            .ThenBy(e => e.Year)
            .ToListAsync();

    public async Task<SportEvent?> GetByIdAsync(int id)
        => await _db.SportEvents
            .Include(e => e.Sport)
            .FirstOrDefaultAsync(e => e.Id == id);

    public async Task AddAsync(SportEvent entity)
        => await _db.SportEvents.AddAsync(entity);

    public Task UpdateAsync(SportEvent entity)
    {
        _db.SportEvents.Update(entity);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(SportEvent entity)
    {
        _db.SportEvents.Remove(entity);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
        => await _db.SaveChangesAsync();

    // ===== ISportEventRepository =====

    public async Task<IEnumerable<SportEvent>> GetEventsByDateAsync(
        int day,
        int month,
        string? sportSlug,
        CancellationToken ct
    )
    {
        var query = _db.SportEvents
            .AsNoTracking()
            .Include(e => e.Sport)
            .Where(e => e.Day == day && e.Month == month);

        if (!string.IsNullOrWhiteSpace(sportSlug))
        {
            var normalizedSlug = sportSlug.Trim().ToLowerInvariant();
            query = query.Where(e => e.Sport != null && e.Sport.Slug == normalizedSlug);
        }

        return await query
            .OrderBy(e => e.Year)
            .ThenBy(e => e.Id)
            .ToListAsync(ct);
    }
}
