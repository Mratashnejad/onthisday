using System;
using System.Threading.Tasks;
using OnThisDay.Api.Domain.Entities;
using OnThisDay.Api.Application.Services;

namespace OnThisDay.Api.Presentation.Admin.Resolvers;

public class SportEventMutation
{
    private readonly ISportEventService _service;

    public SportEventMutation(ISportEventService service)
    {
        _service = service;
    }

    public async Task<SportEvent> CreateSportEvent(
        string title,
        DateTime date,
        int sportId
    )
    {
        var entity = new SportEvent
        {
            Headline = title,
            Year = date.Year,
            Month = date.Month,
            Day = date.Day,
            SportId = sportId
        };

        await _service.AddAsync(entity);
        return entity;
    }

    public async Task<bool> DeleteSportEvent(int id)
    {
        await _service.DeleteAsync(id);
        return true;
    }
}