namespace OnThisDay.Api.Domain.Entities;

public sealed class Sport
{
    public Guid Id { get; set; }
    public string Name {get ; set; } = null!;
    public string Slug { get;set;} = null!;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<SportEvent> Events { get;set;} = new List<SportEvent>();
}
