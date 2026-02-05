using OnThisDay.Api.Domain.Entities;
namespace OnThisDay.Api.Domain.Repositories;

public interface ISportEventRepository : IGenericRepository<SportEvent>
{
    Task<IEnumerable<SportEvent>> GetEventsByDateAsync(int day, int month, CancellationToken ct);
}

