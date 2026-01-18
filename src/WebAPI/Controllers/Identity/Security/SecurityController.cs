using Application.Features.Identity.Security.Interfaces;
using Application.Features.Identity.Core.Interfaces;
using Application.Features.Identity.Security.DTOs.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Identity.Security
{
    [Authorize]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/security")]
    public class SecurityController : BaseController
    {
        private readonly ISecurityService _securityService;
        private readonly ICurrentUserService _currentUserService;

        public SecurityController(
            ISecurityService securityService,
            ICurrentUserService currentUserService)
        {
            _securityService = securityService;
            _currentUserService = currentUserService;
        }

        // Two-Factor Authentication (MFA)
        [HttpPost("2fa/enable")]
        public async Task<IActionResult> EnableTwoFactor()
        {
            var result = await _securityService.EnableTwoFactorAsync(_currentUserService.UserId!);
            return Ok(result);
        }
        [HttpPost("mfa/enable")]
        public async Task<IActionResult> EnableMFA()
        {
            return await EnableTwoFactor();
        }

        [HttpPost("2fa/disable")]
        public async Task<IActionResult> DisableTwoFactor([FromBody] DisableTwoFactorRequest request)
        {
            var result = await _securityService.DisableTwoFactorAsync(_currentUserService.UserId!, request);
            return Ok(result);
        }
        [HttpPost("mfa/disable")]
        public async Task<IActionResult> DisableMFA([FromBody] DisableTwoFactorRequest request)
        {
            return await DisableTwoFactor(request);
        }

        [HttpGet("2fa/status")]
        public async Task<IActionResult> GetTwoFactorStatus()
        {
            var result = await _securityService.GetTwoFactorStatusAsync(_currentUserService.UserId!);
            return Ok(result);
        }
        [HttpGet("mfa/status")]
        public async Task<IActionResult> GetMFAStatus()
        {
            return await GetTwoFactorStatus();
        }

        [HttpPost("2fa/recovery-codes")]
        public async Task<IActionResult> GenerateRecoveryCodes()
        {
            var result = await _securityService.GenerateRecoveryCodesAsync(_currentUserService.UserId!);
            return Ok(result);
        }

        [HttpPost("2fa/verify")]
        public async Task<IActionResult> VerifyTwoFactorToken([FromBody] string token)
        {
            var result = await _securityService.VerifyTwoFactorTokenAsync(_currentUserService.UserId!, token);
            return Ok(result);
        }
        [HttpPost("mfa/verify")]
        public async Task<IActionResult> VerifyMFA([FromBody] string token)
        {
            return await VerifyTwoFactorToken(token);
        }

        // Session Management
        [HttpGet("sessions")]
        public async Task<IActionResult> GetActiveSessions()
        {
            var result = await _securityService.GetActiveSessionsAsync(_currentUserService.UserId!);
            return Ok(result);
        }

        [HttpDelete("sessions/{sessionId}")]
        public async Task<IActionResult> RevokeSession(string sessionId)
        {
            var result = await _securityService.RevokeSessionAsync(_currentUserService.UserId!, sessionId);
            return Ok(result);
        }

        [HttpDelete("sessions")]
        public async Task<IActionResult> RevokeAllSessions()
        {
            var result = await _securityService.RevokeAllSessionsAsync(_currentUserService.UserId!);
            return Ok(result);
        }

        [HttpDelete("sessions/others")]
        public async Task<IActionResult> RevokeOtherSessions([FromBody] string currentSessionId)
        {
            var result = await _securityService.RevokeOtherSessionsAsync(_currentUserService.UserId!, currentSessionId);
            return Ok(result);
        }

        // Security Logs
        [HttpGet("logs")]
        public async Task<IActionResult> GetSecurityLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _securityService.GetSecurityLogsAsync(_currentUserService.UserId!, page, pageSize);
            return Ok(result);
        }

        // Account Lockout (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPost("lock/{userId}")]
        public async Task<IActionResult> LockAccount(string userId, [FromBody] LockAccountRequest request)
        {
            var result = await _securityService.LockAccountAsync(userId, request.LockoutDuration, request.Reason);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("unlock/{userId}")]
        public async Task<IActionResult> UnlockAccount(string userId)
        {
            var result = await _securityService.UnlockAccountAsync(userId);
            return Ok(result);
        }

        [HttpGet("locked")]
        public async Task<IActionResult> IsAccountLocked()
        {
            var result = await _securityService.IsAccountLockedAsync(_currentUserService.UserId!);
            return Ok(result);
        }
    }
}


