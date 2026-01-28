using Microsoft.EntityFrameworkCore;
using OnThisDay.Api.Domain.Entities;
using OnThisDay.Api.Domain.Repositories;
using OnThisDay.Api.Infrastructure.Data;



namespace OnThisDay.Api.Infrastructure.Repositories;

public class SportRepository : ISportRepository
{
    private readonly OnThisDayDbContext _db;

    public SportRepository(OnThisDayDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<Sport>> GetAllAsync(CancellationToken ct)
    {
        return await _db.Sports
            .AsNoTracking()
            .OrderBy(s => s.Name)
            .ToListAsync(ct);
    }

    public async Task<Sport?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await _db.Sports
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id, ct);
    }

    public async Task<Sport?> GetBySlugAsync(string slug, CancellationToken ct)
    {
        return await _db.Sports
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Slug == slug, ct);
    }

    public async Task<Sport> AddAsync(Sport sport, CancellationToken ct)
    {
        await _db.Sports.AddAsync(sport, ct);
        await _db.SaveChangesAsync(ct);
        return sport;
    }

    public async Task UpdateAsync(Sport sport, CancellationToken ct)
    {
        _db.Sports.Update(sport);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Sport sport, CancellationToken ct)
    {
        _db.Sports.Remove(sport);
        await _db.SaveChangesAsync(ct);
    }
}
