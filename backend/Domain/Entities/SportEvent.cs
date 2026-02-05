namespace OnThisDay.Api.Domain.Entities;

public class SportEvent
{
    public int Id { get; set; }

    // تیتر واقعه (مثلاً: ایران ۲-۱ آمریکا در جام جهانی ۹۸)
    public string Headline { get; set; }

    // شرح کامل واقعه (داستان واقعه با جزئیات)
    public string FullDescription { get; set; }

    // اسلاگ برای آدرس واقعه (مثلاً: events/iran-usa-1998)
    public string Slug { get; set; }

    // زمان واقعه (بسیار حیاتی برای کوئری‌های تقویمی)
    public int Day { get; set; }   // 1 to 31
    public int Month { get; set; } // 1 to 12
    public int Year { get; set; }  // e.g., 1998

    // نوع واقعه (برای فیلتر کردن)
    public SportEventType Type { get; set; }

    // --- Relationships ---

    // این واقعه مربوط به کدام ورزش است؟
    public int SportId { get; set; }
    public Sport Sport { get; set; }

    // این واقعه در قالب کدام تورنمنت بوده؟ (Nullable چون برخی وقایع دوستانه یا متفرقه هستند)
    public int? CompetitionId { get; set; }
    public Competition Competition { get; set; }

    // محل برگزاری این واقعه خاص
    public int? LocationId { get; set; }
    public Location Location { get; set; }

    // لیست تمام اشخاص و تیم‌های درگیر (قلب ارتباطات)
    public ICollection<EventParticipant> Participants { get; set; }

    // برای ذخیره لینک‌های ویدیو یا تصاویر مربوط به این واقعه
    public string MediaUrl { get; set; }
}

public enum SportEventType
{
    MatchResult,      // نتیجه مسابقه
    WorldRecord,      // رکورد شکنی
    Achievement,      // کسب افتخار یا مدال
    Scandal,          // حواشی و جنجال‌ها
    Transfer,         // نقل و انتقالات تاریخی
    Retirement,       // خداحافظی
    Other             // سایر موارد
}