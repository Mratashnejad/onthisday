namespace OnThisDay.Api.Domain.Entities;

public class Team {
    public int Id { get; set; }
    public required string Name { get;set;}
    public required string Slug {get;set;}
    public string? Description { get; set;}
    public string? IconUrl {get ; set ;}
    public string? WebsiteUrl { get ; set; }
    public DateTime FoundedYear { get; set; }
    public Location? Location { get; set; }
    public Sport? Sport {get ; set; }
    public ICollection<Person> Members {get; set;} = [];
    
}
