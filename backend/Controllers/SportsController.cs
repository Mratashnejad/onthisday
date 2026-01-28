using Microsoft.AspNetCore.Mvc;
using OnThisDay.Api.Domain.Repositories;

namespace OnThisDay.Api.Controllers;

[ApiController]
[Route("api/sports")]
public sealed class SportsController : ControllerBase
{
    private readonly ISportRepository _sports;

    public SportsController(ISportRepository sports)
    {
        _sports = sports;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var sports = await _sports.GetAllAsync(ct);
        var result = sports.Select(s => new SportDto(s.Id, s.Name, s.Slug, s.IsActive));
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            return BadRequest(new { message = "Slug is required." });
        }

        var sport = await _sports.GetBySlugAsync(slug, ct);
        if (sport is null)
        {
            return NotFound();
        }

        return Ok(new SportDto(sport.Id, sport.Name, sport.Slug, sport.IsActive));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SportUpsertRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Slug))
        {
            return BadRequest(new { message = "Name and slug are required." });
        }

        var existing = await _sports.GetBySlugAsync(request.Slug, ct);
        if (existing is not null)
        {
            return Conflict(new { message = "Slug already exists." });
        }

        var now = DateTime.UtcNow;
        var sport = new Domain.Entities.Sport
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Slug = request.Slug.Trim(),
            IsActive = request.IsActive,
            CreatedAt = now,
            UpdatedAt = now
        };

        var created = await _sports.AddAsync(sport, ct);
        return CreatedAtAction(nameof(GetBySlug), new { slug = created.Slug }, new SportDto(created.Id, created.Name, created.Slug, created.IsActive));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] SportUpsertRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Slug))
        {
            return BadRequest(new { message = "Name and slug are required." });
        }

        var sport = await _sports.GetByIdAsync(id, ct);
        if (sport is null)
        {
            return NotFound();
        }

        var existing = await _sports.GetBySlugAsync(request.Slug, ct);
        if (existing is not null && existing.Id != id)
        {
            return Conflict(new { message = "Slug already exists." });
        }

        sport.Name = request.Name.Trim();
        sport.Slug = request.Slug.Trim();
        sport.IsActive = request.IsActive;
        sport.UpdatedAt = DateTime.UtcNow;

        await _sports.UpdateAsync(sport, ct);
        return Ok(new SportDto(sport.Id, sport.Name, sport.Slug, sport.IsActive));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var sport = await _sports.GetByIdAsync(id, ct);
        if (sport is null)
        {
            return NotFound();
        }

        await _sports.DeleteAsync(sport, ct);
        return NoContent();
    }

    public sealed record SportDto(Guid Id, string Name, string Slug, bool IsActive);

    public sealed record SportUpsertRequest(string Name, string Slug, bool IsActive);
}
