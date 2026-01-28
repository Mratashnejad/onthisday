using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using OnThisDay.Api.Domain.Repositories;

namespace OnThisDay.Api.Controllers;

[ApiController]
[Route("api/sports")]
public sealed class SportEventsController : ControllerBase
{
    private readonly ISportRepository _sports;
    private readonly ISportEventRepository _sportEvents;

    public SportEventsController(ISportRepository sports, ISportEventRepository sportEvents)
    {
        _sports = sports;
        _sportEvents = sportEvents;
    }

    [HttpGet("events")]
    public async Task<IActionResult> GetByDate([FromQuery] int day, [FromQuery] int month, [FromQuery] int? year, [FromQuery] string? calendar, CancellationToken ct)
    {
        if (!TryNormalizeDate(new DateInput(day, month, year, calendar), out var normalizedDay, out var normalizedMonth, out _, out var errorMessage))
        {
            return BadRequest(new { message = errorMessage });
        }

        var events = await _sportEvents.GetByDateAsync(normalizedDay, normalizedMonth, ct);
        return Ok(events.Select(ToDto));
    }

    [HttpGet("{slug}/events")]
    public async Task<IActionResult> GetBySportAndDate(string slug, [FromQuery] int day, [FromQuery] int month, [FromQuery] int? year, [FromQuery] string? calendar, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            return BadRequest(new { message = "Slug is required." });
        }

        if (!TryNormalizeDate(new DateInput(day, month, year, calendar), out var normalizedDay, out var normalizedMonth, out _, out var errorMessage))
        {
            return BadRequest(new { message = errorMessage });
        }

        var sport = await _sports.GetBySlugAsync(slug, ct);
        if (sport is null)
        {
            return NotFound();
        }

        var events = await _sportEvents.GetBySportAndDateAsync(sport.Id, normalizedDay, normalizedMonth, ct);
        return Ok(events.Select(ToDto));
    }

    [HttpGet("events/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var sportEvent = await _sportEvents.GetByIdAsync(id, ct);
        if (sportEvent is null)
        {
            return NotFound();
        }

        return Ok(ToDto(sportEvent));
    }

    [HttpPost("{slug}/events")]
    public async Task<IActionResult> Create(string slug, [FromBody] SportEventUpsertRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            return BadRequest(new { message = "Slug is required." });
        }

        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Description))
        {
            return BadRequest(new { message = "Title and description are required." });
        }

        if (!TryNormalizeDate(new DateInput(request.Day, request.Month, request.Year, request.Calendar), out var normalizedDay, out var normalizedMonth, out var normalizedYear, out var errorMessage))
        {
            return BadRequest(new { message = errorMessage });
        }

        var sport = await _sports.GetBySlugAsync(slug, ct);
        if (sport is null)
        {
            return NotFound();
        }

        var now = DateTime.UtcNow;
        var sportEvent = new Domain.Entities.SportEvent
        {
            Id = Guid.NewGuid(),
            SportId = sport.Id,
            Day = normalizedDay,
            Month = normalizedMonth,
            Year = normalizedYear,
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Importance = request.Importance <= 0 ? 1 : request.Importance,
            Location = request.Location,
            SourceUrl = request.SourceUrl,
            CreatedAt = now,
            UpdatedAt = now
        };

        var created = await _sportEvents.AddAsync(sportEvent, ct);
        created.Sport = sport;
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToDto(created));
    }

    [HttpPut("events/{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] SportEventUpsertRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Description))
        {
            return BadRequest(new { message = "Title and description are required." });
        }

        if (!TryNormalizeDate(new DateInput(request.Day, request.Month, request.Year, request.Calendar), out var normalizedDay, out var normalizedMonth, out var normalizedYear, out var errorMessage))
        {
            return BadRequest(new { message = errorMessage });
        }

        var sportEvent = await _sportEvents.GetByIdAsync(id, ct);
        if (sportEvent is null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(request.SportSlug))
        {
            var sport = await _sports.GetBySlugAsync(request.SportSlug, ct);
            if (sport is null)
            {
                return NotFound();
            }

            sportEvent.SportId = sport.Id;
            sportEvent.Sport = sport;
        }

        sportEvent.Day = normalizedDay;
        sportEvent.Month = normalizedMonth;
        sportEvent.Year = normalizedYear;
        sportEvent.Title = request.Title.Trim();
        sportEvent.Description = request.Description.Trim();
        sportEvent.Importance = request.Importance <= 0 ? 1 : request.Importance;
        sportEvent.Location = request.Location;
        sportEvent.SourceUrl = request.SourceUrl;
        sportEvent.UpdatedAt = DateTime.UtcNow;

        await _sportEvents.UpdateAsync(sportEvent, ct);
        return Ok(ToDto(sportEvent));
    }

    [HttpDelete("events/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var sportEvent = await _sportEvents.GetByIdAsync(id, ct);
        if (sportEvent is null)
        {
            return NotFound();
        }

        await _sportEvents.DeleteAsync(sportEvent, ct);
        return NoContent();
    }

    private static SportEventDto ToDto(Domain.Entities.SportEvent e)
    {
        var yearForConversion = e.Year ?? DateTime.UtcNow.Year;
        var persian = new PersianCalendar();
        int? persianYear = null;
        int? persianMonth = null;
        int? persianDay = null;

        try
        {
            var gregorianDate = new DateTime(yearForConversion, e.Month, e.Day);
            persianYear = e.Year is null ? null : persian.GetYear(gregorianDate);
            persianMonth = persian.GetMonth(gregorianDate);
            persianDay = persian.GetDayOfMonth(gregorianDate);
        }
        catch
        {
        }

        return new SportEventDto(
            e.Id,
            e.Day,
            e.Month,
            e.Year,
            e.Title,
            e.Description,
            e.Importance,
            e.Location,
            e.SourceUrl,
            e.Sport.Name,
            e.Sport.Slug,
            e.Day,
            e.Month,
            e.Year,
            persianDay,
            persianMonth,
            persianYear
        );
    }

    private static bool TryNormalizeDate(DateInput input, out int day, out int month, out int? year, out string? errorMessage)
    {
        day = input.Day;
        month = input.Month;
        year = input.Year;
        errorMessage = null;

        if (day < 1 || month < 1)
        {
            errorMessage = "Day and month are required and must be valid.";
            return false;
        }

        var calendar = NormalizeCalendar(input.Calendar);
        if (calendar == "persian")
        {
            var persian = new PersianCalendar();
            var persianYear = input.Year ?? persian.GetYear(DateTime.UtcNow);
            try
            {
                var gregorian = persian.ToDateTime(persianYear, month, day, 0, 0, 0, 0);
                day = gregorian.Day;
                month = gregorian.Month;
                year = input.Year is null ? null : gregorian.Year;
                return true;
            }
            catch
            {
                errorMessage = "Day and month are required and must be valid.";
                return false;
            }
        }

        if (month > 12)
        {
            errorMessage = "Day and month are required and must be valid.";
            return false;
        }

        var validationYear = input.Year ?? 2000;
        var maxDay = DateTime.DaysInMonth(validationYear, month);
        if (day > maxDay)
        {
            errorMessage = "Day and month are required and must be valid.";
            return false;
        }

        return true;
    }

    private static string NormalizeCalendar(string? calendar)
    {
        if (string.IsNullOrWhiteSpace(calendar))
        {
            return "persian";
        }

        var value = calendar.Trim().ToLowerInvariant();
        return value is "utc" or "gregorian" ? "utc" : "persian";
    }

    public sealed record SportEventDto(
        Guid Id,
        int Day,
        int Month,
        int? Year,
        string Title,
        string Description,
        int Importance,
        string? Location,
        string? SourceUrl,
        string SportName,
        string SportSlug,
        int GregorianDay,
        int GregorianMonth,
        int? GregorianYear,
        int? PersianDay,
        int? PersianMonth,
        int? PersianYear
    );

    public sealed record SportEventUpsertRequest(
        string Title,
        string Description,
        int Day,
        int Month,
        int? Year,
        string? Calendar,
        int Importance,
        string? Location,
        string? SourceUrl,
        string? SportSlug
    );

    public sealed record DateInput(int Day, int Month, int? Year, string? Calendar);
}
