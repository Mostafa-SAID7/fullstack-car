using System.Security.Claims;

namespace Application.Common.Interfaces.Identity.Core
{
    public interface IJwtTokenService
    {
        string GenerateAccessToken(Guid userId, string email, string fullName, IEnumerable<string> roles);
        string GenerateRefreshToken();
        ClaimsPrincipal? ValidateToken(string token);
        Guid? GetUserIdFromToken(string token);
    }
}