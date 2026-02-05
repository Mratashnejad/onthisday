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

    public async Task<IEnumerable<Sport>> GetAllAsync()
    {
        return await _db.Sports
            .AsNoTracking()
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<Sport?> GetByIdAsync(int id)
    {
        return await _db.Sports
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Sport?> GetBySlugAsync(string slug)
    {
        return await _db.Sports
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Slug == slug);
    }

    public async Task AddAsync(Sport sport)
    {
        await _db.Sports.AddAsync(sport);
    }

    public Task UpdateAsync(Sport sport)
    {
        _db.Sports.Update(sport);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Sport sport)
    {
        _db.Sports.Remove(sport);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}