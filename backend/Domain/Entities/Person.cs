namespace OnThisDay.Api.Domain.Entities;
public class Person {
    public int Id { get; set; }
    public required string Firstname {get; set;}
    public required string Slug {get;set;}
    public string? Lastname { get ; set;}
    // عنوان یا لقب این شخص (مثلاً: King , CR7 , Wicher )
    public string? Title { get ; set; }
    public string? Nationality { get; set; }
    public DateTime BirthDate { get ; set; }
    public DateTime? DeathDate { get ; set; }
    public string? Biography { get ; set ;}
    public string? ProfileImageUrl { get ; set; }
    public Gender Gender { get ; set;} 
    // وضعیت فعلی (مثلاً: Active, Retired, Deceased)
    public PersonalStatus Status { get ; set; }
    // یک شخص می‌تواند در چندین ورزش فعالیت داشته باشد (مثلاً دوومیدانی و فوتبال)
    public ICollection<Sport> Sports {get; set;} = [];
    // تیم‌هایی که این شخص در آن‌ها بازی یا مربیگری کرده است
    public ICollection<Team> Teams {get; set;}= [];
    // تمام وقایع تاریخی که این شخص در آن‌ها نقش داشته است
    public ICollection<EventParticipant> EventParticipations {get; set;} = [];
}


public enum Gender {
    Male,
    Female,
    Other
}

public enum PersonalStatus {
    Active,
    Retired,
    Deceased
}
