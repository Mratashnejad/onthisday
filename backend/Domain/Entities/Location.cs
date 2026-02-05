namespace OnThisDay.Api.Domain.Entities;

public class Location {
    public int Id { get; set; }
    public required string Slug {get;set;}
    public string? Name { get; set; }
    public string? City { get ; set;}
    public string? Country  { get ; set;}
    public string? Description { get; set;}
}

