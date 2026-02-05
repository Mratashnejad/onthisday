namespace OnThisDay.Api.Domain.Entities;

public class EventParticipant
{
    public int Id { get; set; }

    // اتصال به واقعه اصلی
    public int SportEventId { get; set; }
    public required SportEvent SportEvent { get; set; }
    // --- شرکت‌کننده (یا شخص است یا تیم) ---
    
    // اگر واقعه مربوط به یک شخص بود (مثلاً رکورد انفرادی یا گلزن)
    public int? PersonId { get; set; }
    public Person? Person { get; set; }

    // اگر واقعه مربوط به یک تیم بود (مثلاً برد یک باشگاه)
    public int? TeamId { get; set; }
    public Team? Team { get; set; }

    // --- جزئیات نقش و نتیجه ---

    // نقش در این واقعه (مثلاً: برنده، بازنده، زننده گل، داور)
    public ParticipantRole Role { get; set; }

    // جزئیات عددی یا متنی (مثلاً: "21 امتیاز" یا "دقیقه 90")
    public string? PerformanceNote { get; set; }

    // آیا این شرکت‌کننده نقش اصلی در تیتر واقعه دارد؟
    public bool IsPrimary { get; set; } 
}

public enum ParticipantRole
{
    Winner,
    Loser,
    Draw,
    Scorer,      // گلزن یا امتیاز آور
    Coach,       // مربی در آن واقعه
    Referee,     // داور
    Participant, // صرفاً حضور داشته
    RecordBreaker // شکننده رکورد
}