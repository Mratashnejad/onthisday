using OnThisDay.Api.Domain.Entities;

namespace OnThisDay.Api.Application.Auth;

public interface IJwtTokenService
{
    AuthPayload CreateAdminToken(User user);
}
