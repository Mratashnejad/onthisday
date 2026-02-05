using OnThisDay.Api.Domain.Entities;
namespace OnThisDay.Api.Domain.Repositories;
public interface ISportRepository : IGenericRepository<Sport>
{
    Task<Sport?> GetBySlugAsync(string slug);
}
