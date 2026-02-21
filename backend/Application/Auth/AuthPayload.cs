namespace OnThisDay.Api.Application.Auth;

public sealed class AuthPayload
{
    public required string AccessToken { get; init; }
    public required DateTime ExpiresAtUtc { get; init; }
    public required Guid UserId { get; init; }
    public required string Username { get; init; }
    public required string Email { get; init; }
}
