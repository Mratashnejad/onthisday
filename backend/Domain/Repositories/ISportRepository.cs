using OnThisDay.Api.Domain.Entities;

namespace OnThisDay.Api.Domain.Repositories;

public interface ISportRepository
{
    Task<IReadOnlyList<Sport>> GetAllAsync(CancellationToken ct);
    Task<Sport?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Sport?> GetBySlugAsync(string slug, CancellationToken ct);
    Task<Sport> AddAsync(Sport sport, CancellationToken ct);
    Task UpdateAsync(Sport sport, CancellationToken ct);
    Task DeleteAsync(Sport sport, CancellationToken ct);
}
