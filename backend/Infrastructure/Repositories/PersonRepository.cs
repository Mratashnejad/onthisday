using Microsoft.EntityFrameworkCore;
using OnThisDay.Api.Domain.Entities;
using OnThisDay.Api.Domain.Repositories;
using OnThisDay.Api.Infrastructure.Data;

namespace OnThisDay.Api.Infrastructure.Repositories;

public sealed class PersonRepository : IPersonRepository
{
    private readonly OnThisDayDbContext _db;

    public PersonRepository(OnThisDayDbContext db)
    {
        _db = db;
    }

    public async Task<Person?> GetByIdAsync(int id)
        => await _db.Persons.FindAsync(id);

    public async Task<IEnumerable<Person>> GetAllAsync()
        => await _db.Persons
            .AsNoTracking()
            .ToListAsync();

    public async Task<Person?> GetBySlugAsync(string slug)
        => await _db.Persons
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Slug == slug);

    public async Task<IEnumerable<Person>> GetAllWithRelationsAsync()
        => await _db.Persons
            .AsNoTracking()
            .ToListAsync();

    public async Task AddAsync(Person entity)
    {
        await _db.Persons.AddAsync(entity);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Person entity)
    {
        _db.Persons.Update(entity);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Person entity)
    {
        _db.Persons.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public Task SaveChangesAsync()
        => _db.SaveChangesAsync();
}