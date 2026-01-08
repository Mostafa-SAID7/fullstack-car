namespace Application.Features.Identity.Core.Interfaces;

public interface ICurrentUserService
{
    string? UserId { get; }
    string? UserName { get; }
    string? Email { get; }
    bool IsAuthenticated { get; }
    IEnumerable<string> Roles { get; }
    bool IsInRole(string role);
    bool IsActive { get; }
    bool IsEmailConfirmed { get; }
    string? GetClaim(string claimType);
    IEnumerable<string> GetClaims(string claimType);
}
