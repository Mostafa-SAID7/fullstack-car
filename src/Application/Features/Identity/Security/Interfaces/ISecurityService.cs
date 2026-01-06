using Application.Common.Models;
using Application.Features.Identity.Security.DTOs.Requests;
using Application.Features.Identity.Security.DTOs.Responses;

namespace Application.Features.Identity.Security.Interfaces
{
    public interface ISecurityService
    {
        // Two-Factor Authentication
        Task<Result<TwoFactorSetupResponse>> EnableTwoFactorAsync(string userId);
        Task<Result> DisableTwoFactorAsync(string userId, DisableTwoFactorRequest request);
        Task<Result<bool>> GetTwoFactorStatusAsync(string userId);
        Task<Result<IEnumerable<string>>> GenerateRecoveryCodesAsync(string userId);
        Task<Result<bool>> VerifyTwoFactorTokenAsync(string userId, string token);

        // Session Management
        Task<Result<IEnumerable<UserSessionResponse>>> GetActiveSessionsAsync(string userId);
        Task<Result> RevokeSessionAsync(string userId, string sessionId);
        Task<Result> RevokeAllSessionsAsync(string userId);
        Task<Result> RevokeOtherSessionsAsync(string userId, string currentSessionId);

        // Security Logs
        Task<Result<IEnumerable<SecurityLogResponse>>> GetSecurityLogsAsync(string userId, int page = 1, int pageSize = 20);
        Task LogSecurityEventAsync(string userId, string eventType, string description, string? ipAddress = null);

        // Account Lockout
        Task<Result> LockAccountAsync(string userId, TimeSpan lockoutDuration, string reason);
        Task<Result> UnlockAccountAsync(string userId);
        Task<Result<bool>> IsAccountLockedAsync(string userId);
    }
}
