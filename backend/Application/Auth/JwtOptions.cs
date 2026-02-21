namespace OnThisDay.Api.Application.Auth;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "OnThisDay.Api";

    public string Audience { get; set; } = "OnThisDay.Admin";

    public string Key { get; set; } = "CHANGE_THIS_DEVELOPMENT_KEY_WITH_A_LONG_SECRET";

    public int ExpiryMinutes { get; set; } = 720;
}
