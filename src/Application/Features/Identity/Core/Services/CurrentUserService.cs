using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Application.Features.Identity.Core.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? UserId => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

        public string? UserName => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Name);

        public string? Email => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);

        public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

        public IEnumerable<string> Roles => _httpContextAccessor.HttpContext?.User?.FindAll(ClaimTypes.Role)?.Select(c => c.Value) ?? Enumerable.Empty<string>();

        public bool IsInRole(string role)
        {
            return _httpContextAccessor.HttpContext?.User?.IsInRole(role) ?? false;
        }

        public bool IsActive
        {
            get
            {
                var isActiveClaim = GetClaim("isActive");
                return bool.TryParse(isActiveClaim, out var isActive) && isActive;
            }
        }

        public bool IsEmailConfirmed
        {
            get
            {
                var emailVerifiedClaim = GetClaim("email_verified");
                return bool.TryParse(emailVerifiedClaim, out var isVerified) && isVerified;
            }
        }

        public string? GetClaim(string claimType)
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirstValue(claimType);
        }

        public IEnumerable<string> GetClaims(string claimType)
        {
            return _httpContextAccessor.HttpContext?.User?.FindAll(claimType)?.Select(c => c.Value) ?? Enumerable.Empty<string>();
        }
    }
}
