using System.Collections.Generic;
using System.Threading.Tasks;
using OnThisDay.Api.Domain.Entities;

namespace OnThisDay.Api.Application.Services;

public interface ISportEventService
{
    // Queries
    Task<IEnumerable<SportEvent>> GetAll();
    Task<SportEvent?> GetByIdAsync(int id);

    // Commands
    Task<SportEvent> AddAsync(SportEvent entity);
    Task DeleteAsync(int id);
}