using OnThisDay.Api.Domain.Entities;
using OnThisDay.Api.Application.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OnThisDay.Api.Presentation.Web.Resolvers;

public class SportEventQuery
{
    private readonly ISportEventService _repo;

    public SportEventQuery(ISportEventService repo)
    {
        _repo = repo;
    }

    public Task<IEnumerable<SportEvent>> GetSportEvents()
        => _repo.GetAll();

    public Task<SportEvent?> GetSportEvent(int id)
        => _repo.GetByIdAsync(id);
}