namespace OnThisDay.Api.Domain.Entities;

public class Sport{
    public int Id { get; set; }
    public string Name { get;set;}
    public string Slug { get; set; }
    public string Description { get; set;}
    public string IconUrl {get ; set ;}

    public SportType Type { get; set;}

    public ICollection<Competition> Competitions {get; set;}
    public ICollection<Person> Athletes {get;set;}
    public ICollection<SportEvent> Events {get; set;}
}

public enum SportType {
    Team,        // تیمی مثل فوتبال
    Individual,  // انفرادی مثل تنیس یا گلف
    Combat,      // رزمی مثل بوکس
    Motorsport,  // موتوری مثل فرمول یک
    Olympic      // ورزش‌های چندگانه المپیکی
}
