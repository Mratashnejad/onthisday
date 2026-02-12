using OnThisDay.Api.Domain.Entities;

namespace OnThisDay.Api.Domain.Repositories;


public interface IPersonRepository : IGenericRepository<Person>
{
    Task<Person?> GetBySlugAsync(string slug);
    Task<IEnumerable<Person>> GetAllWithRelationsAsync();

}