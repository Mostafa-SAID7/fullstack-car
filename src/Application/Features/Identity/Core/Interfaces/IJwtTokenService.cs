using System.Security.Claims;

namespace Application.Features.Identity.Core.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateAccessToken(Guid userId, string email, string fullName, IEnumerable<string> roles);
        string GenerateRefreshToken();
        ClaimsPrincipal? ValidateToken(string token);
        Guid? GetUserIdFromToken(string token);
    }
}