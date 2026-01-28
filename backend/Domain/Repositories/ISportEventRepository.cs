using OnThisDay.Api.Domain.Entities;
namespace OnThisDay.Api.Domain.Repositories;


public interface ISportEventRepository
{
    Task<IReadOnlyList<SportEvent>> GetByDateAsync(
        int day,
        int month,
        CancellationToken ct
    );

    Task<IReadOnlyList<SportEvent>> GetBySportAndDateAsync(
        Guid sportId,
        int day,
        int month,
        CancellationToken ct
    );

    Task<SportEvent?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<SportEvent> AddAsync(SportEvent sportEvent, CancellationToken ct);
    Task UpdateAsync(SportEvent sportEvent, CancellationToken ct);
    Task DeleteAsync(SportEvent sportEvent, CancellationToken ct);
}
