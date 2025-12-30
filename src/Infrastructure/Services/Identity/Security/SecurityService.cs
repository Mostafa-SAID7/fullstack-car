using Application.Common.Interfaces.Identity.Security;
using Application.Common.Models;
using Application.Features.Identity.Security.DTOs.Requests;
using Application.Features.Identity.Security.DTOs.Responses;
using Microsoft.AspNetCore.Identity;
using Domain.Entities.Identity;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services.Identity.Security
{
    public class SecurityService : ISecurityService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public SecurityService(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }
        
        public async Task<Result<TwoFactorSetupResponse>> EnableTwoFactorAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result<TwoFactorSetupResponse>.Failure(new[] { "User not found" });

            await _userManager.SetTwoFactorEnabledAsync(user, true);
            return Result<TwoFactorSetupResponse>.Success(new TwoFactorSetupResponse()); // Placeholder
        }

        public async Task<Result> DisableTwoFactorAsync(string userId, DisableTwoFactorRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result.Failure(new[] { "User not found" });

            await _userManager.SetTwoFactorEnabledAsync(user, false);
            return Result.Success();
        }

        public async Task<Result<bool>> GetTwoFactorStatusAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result<bool>.Failure(new[] { "User not found" });

            return Result<bool>.Success(user.TwoFactorEnabled);
        }

        public async Task<Result<IEnumerable<string>>> GenerateRecoveryCodesAsync(string userId)
        {
            return Result<IEnumerable<string>>.Success(new List<string>()); // Placeholder
        }

        public async Task<Result<bool>> VerifyTwoFactorTokenAsync(string userId, string token)
        {
            return Result<bool>.Success(true); // Placeholder
        }

        public async Task<Result<IEnumerable<UserSessionResponse>>> GetActiveSessionsAsync(string userId)
        {
            var sessions = await _context.UserSessions
                .Where(s => s.UserId == Guid.Parse(userId) && s.IsActive)
                .Select(s => new UserSessionResponse
                {
                    SessionId = s.Id.ToString(),
                    DeviceInfo = s.DeviceInfo,
                    IpAddress = s.IpAddress,
                    LastActivity = s.LastActivityAt,
                    CreatedAt = s.CreatedAt,
                    ExpiresAt = s.ExpiresAt,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            return Result<IEnumerable<UserSessionResponse>>.Success(sessions);
        }

        public async Task<Result> RevokeSessionAsync(string userId, string sessionId)
        {
            var session = await _context.UserSessions.FindAsync(Guid.Parse(sessionId));
            if (session == null || session.UserId != Guid.Parse(userId))
                return Result.Failure(new[] { "Session not found" });

            session.IsActive = false;
            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Result> RevokeAllSessionsAsync(string userId)
        {
            var sessions = await _context.UserSessions
                .Where(s => s.UserId == Guid.Parse(userId) && s.IsActive)
                .ToListAsync();

            foreach (var session in sessions)
            {
                session.IsActive = false;
            }

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Result> RevokeOtherSessionsAsync(string userId, string currentSessionId)
        {
            var sessions = await _context.UserSessions
                .Where(s => s.UserId == Guid.Parse(userId) && s.IsActive && s.Id != Guid.Parse(currentSessionId))
                .ToListAsync();

            foreach (var session in sessions)
            {
                session.IsActive = false;
            }

            await _context.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Result<IEnumerable<SecurityLogResponse>>> GetSecurityLogsAsync(string userId, int page = 1, int pageSize = 20)
        {
            var logs = await _context.SecurityLogs
                .Where(l => l.UserId == Guid.Parse(userId))
                .OrderByDescending(l => l.Timestamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(l => new SecurityLogResponse
                {
                    Id = l.Id,
                    EventType = l.EventType,
                    Description = l.Description,
                    IpAddress = l.IpAddress,
                    UserAgent = l.UserAgent,
                    Timestamp = l.Timestamp,
                    IsSuccessful = l.IsSuccessful,
                    AdditionalData = l.AdditionalData
                })
                .ToListAsync();

            return Result<IEnumerable<SecurityLogResponse>>.Success(logs);
        }

        public async Task LogSecurityEventAsync(string userId, string eventType, string description, string? ipAddress = null)
        {
            var log = new SecurityLog
            {
                UserId = Guid.Parse(userId),
                EventType = eventType,
                Description = description,
                IpAddress = ipAddress,
                Timestamp = DateTime.UtcNow,
                IsSuccessful = true
            };

            _context.SecurityLogs.Add(log);
            await _context.SaveChangesAsync();
        }

        public async Task<Result> LockAccountAsync(string userId, TimeSpan lockoutDuration, string reason)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result.Failure(new[] { "User not found" });

            await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.Add(lockoutDuration));
            return Result.Success();
        }

        public async Task<Result> UnlockAccountAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result.Failure(new[] { "User not found" });

            await _userManager.SetLockoutEndDateAsync(user, null);
            return Result.Success();
        }

        public async Task<Result<bool>> IsAccountLockedAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return Result<bool>.Failure(new[] { "User not found" });

            var isLocked = await _userManager.IsLockedOutAsync(user);
            return Result<bool>.Success(isLocked);
        }
    }
}
