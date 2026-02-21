using OnThisDay.Api.Domain.Entities;
using OnThisDay.Api.Domain.Repositories;

namespace OnThisDay.Api.Application.Services;

public class SportEventService : ISportEventService
{
    private readonly ISportEventRepository _repo;

    public SportEventService(ISportEventRepository repo)
    {
        _repo = repo;
    }

    // Queries
    public Task<IEnumerable<SportEvent>> GetAll()
        => _repo.GetAllAsync();

    public Task<SportEvent?> GetByIdAsync(int id)
        => _repo.GetByIdAsync(id);

    public Task<IEnumerable<SportEvent>> GetByDateAsync(
        int day,
        int month,
        string? sportSlug,
        CancellationToken ct = default
    )
        => _repo.GetEventsByDateAsync(day, month, sportSlug, ct);

    // Commands
    public async Task<SportEvent> AddAsync(SportEvent entity)
    {
        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null) return;

        await _repo.DeleteAsync(entity);
        await _repo.SaveChangesAsync();
    }
}
