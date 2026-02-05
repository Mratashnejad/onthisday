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
        => await _db.SportEvents.AsNoTracking().ToListAsync();

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
        CancellationToken ct
    )
    {
        return await _db.SportEvents
            .AsNoTracking()
            .Where(e => e.Day == day && e.Month == month)
            .ToListAsync(ct);
    }
}
