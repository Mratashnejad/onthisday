namespace OnThisDay.Api.Domain.Entities;

public sealed class SportEvent
{
    public Guid Id { get; set; }

    public int Day { get; set; }
    public int Month { get; set; }
    public int? Year { get; set; }

    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;

    public int Importance { get; set; }
    public string? Location { get; set; }
    public string? SourceUrl { get; set; }

    // FK
    public Guid SportId { get; set; }
    public Sport Sport { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}