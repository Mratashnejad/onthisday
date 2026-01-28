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

    public async Task<IReadOnlyList<SportEvent>> GetByDateAsync(int day, int month, CancellationToken ct)
    {
        return await _db.SportEvents
            .AsNoTracking()
            .Include(e => e.Sport)
            .Where(e => e.Day == day && e.Month == month)
            .OrderByDescending(e => e.Importance)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<SportEvent>> GetBySportAndDateAsync(Guid sportId, int day, int month, CancellationToken ct)
    {
        return await _db.SportEvents
            .AsNoTracking()
            .Include(e => e.Sport)
            .Where(e => e.SportId == sportId && e.Day == day && e.Month == month)
            .OrderByDescending(e => e.Importance)
            .ToListAsync(ct);
    }

    public async Task<SportEvent?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _db.SportEvents
            .Include(e => e.Sport)
            .FirstOrDefaultAsync(e => e.Id == id, ct);
    }

    public async Task<SportEvent> AddAsync(SportEvent sportEvent, CancellationToken ct)
    {
        await _db.SportEvents.AddAsync(sportEvent, ct);
        await _db.SaveChangesAsync(ct);
        return sportEvent;
    }

    public async Task UpdateAsync(SportEvent sportEvent, CancellationToken ct)
    {
        _db.SportEvents.Update(sportEvent);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(SportEvent sportEvent, CancellationToken ct)
    {
        _db.SportEvents.Remove(sportEvent);
        await _db.SaveChangesAsync(ct);
    }
}
