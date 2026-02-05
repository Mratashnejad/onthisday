namespace OnThisDay.Api.Domain.Entities;

public class Competition
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? ShortName { get; set; }
    public required string Slug { get; set; }
    public CompetitionLevel Level { get; set; }
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public int SportId { get; set; }
    public Sport? Sport { get; set; }
    public ICollection<SportEvent> Events { get; set; } = [];
}



public enum CompetitionLevel
{
    International, // بین‌المللی (جام جهانی)
    Continental,   // قاره‌ای (جام ملت‌های آسیا)
    National,      // ملی (لیگ برتر ایران)
    Club,          // باشگاهی (جام حذفی)
    Amateur        // آماتور
}