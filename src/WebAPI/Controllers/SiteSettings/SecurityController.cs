using Application.Features.Admin.Security.Commands;
using Application.Features.Admin.Security.DTOs;
using Application.Features.Admin.Security.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.SiteSettings
{
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/security")]
    public class SecurityController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public SecurityController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet("settings")]
        [OutputCache(Duration = 300, Tags = new[] { "Security", "Settings" })]
        public async Task<IActionResult> GetSecuritySettings()
        {
            var query = new GetSecuritySettingsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Security settings retrieved successfully");

            return BadRequest("Failed to retrieve security settings", result.Errors);
        }

        [HttpPut("settings")]
        public async Task<IActionResult> UpdateSecuritySettings([FromBody] UpdateSecuritySettingsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateSecuritySettingsCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Security settings updated successfully");

            return BadRequest("Failed to update security settings", result.Errors);
        }

        [HttpGet("audit-logs")]
        [OutputCache(Duration = 60, Tags = new[] { "Security", "AuditLogs" })]
        public async Task<IActionResult> GetSecurityAuditLogs(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? eventType = null,
            [FromQuery] string? userId = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = new GetSecurityAuditLogsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                EventType = eventType,
                UserId = userId,
                FromDate = fromDate,
                ToDate = toDate
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Security audit logs retrieved successfully");

            return BadRequest("Failed to retrieve security audit logs", result.Errors);
        }

        [HttpGet("failed-logins")]
        [OutputCache(Duration = 60, Tags = new[] { "Security", "FailedLogins" })]
        public async Task<IActionResult> GetFailedLoginAttempts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? ipAddress = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = new GetFailedLoginAttemptsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                IpAddress = ipAddress,
                FromDate = fromDate,
                ToDate = toDate
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Failed login attempts retrieved successfully");

            return BadRequest("Failed to retrieve failed login attempts", result.Errors);
        }

        [HttpPost("block-ip")]
        public async Task<IActionResult> BlockIpAddress([FromBody] BlockIpAddressRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new BlockIpAddressCommand
            {
                Request = request,
                BlockedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("IP address blocked successfully");

            if (result.Errors.Any(e => e.Contains("already blocked")))
                return BadRequest("IP address is already blocked", result.Errors);

            return BadRequest("Failed to block IP address", result.Errors);
        }

        [HttpDelete("unblock-ip/{ipAddress}")]
        public async Task<IActionResult> UnblockIpAddress(string ipAddress)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UnblockIpAddressCommand
            {
                IpAddress = ipAddress,
                UnblockedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("IP address unblocked successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("IP address block not found");

            return BadRequest("Failed to unblock IP address", result.Errors);
        }

        [HttpGet("blocked-ips")]
        [OutputCache(Duration = 300, Tags = new[] { "Security", "BlockedIPs" })]
        public async Task<IActionResult> GetBlockedIpAddresses(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = new GetBlockedIpAddressesQuery
            {
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Blocked IP addresses retrieved successfully");

            return BadRequest("Failed to retrieve blocked IP addresses", result.Errors);
        }

        [HttpGet("suspicious-activities")]
        [OutputCache(Duration = 60, Tags = new[] { "Security", "SuspiciousActivities" })]
        public async Task<IActionResult> GetSuspiciousActivities(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? activityType = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = new GetSuspiciousActivitiesQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                ActivityType = activityType,
                FromDate = fromDate,
                ToDate = toDate
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Suspicious activities retrieved successfully");

            return BadRequest("Failed to retrieve suspicious activities", result.Errors);
        }

        [HttpPost("password-policy")]
        public async Task<IActionResult> UpdatePasswordPolicy([FromBody] UpdatePasswordPolicyRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdatePasswordPolicyCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Password policy updated successfully");

            return BadRequest("Failed to update password policy", result.Errors);
        }

        [HttpGet("password-policy")]
        [OutputCache(Duration = 600, Tags = new[] { "Security", "PasswordPolicy" })]
        public async Task<IActionResult> GetPasswordPolicy()
        {
            var query = new GetPasswordPolicyQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Password policy retrieved successfully");

            return BadRequest("Failed to retrieve password policy", result.Errors);
        }

        [HttpPost("two-factor/enforce")]
        public async Task<IActionResult> EnforceTwoFactorAuthentication([FromBody] EnforceTwoFactorRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new EnforceTwoFactorAuthenticationCommand
            {
                Request = request,
                EnforcedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Two-factor authentication enforcement updated successfully");

            return BadRequest("Failed to update two-factor authentication enforcement", result.Errors);
        }

        [HttpGet("session-management")]
        [OutputCache(Duration = 60, Tags = new[] { "Security", "Sessions" })]
        public async Task<IActionResult> GetActiveSessions(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? userId = null)
        {
            var query = new GetActiveSessionsQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                UserId = userId
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Active sessions retrieved successfully");

            return BadRequest("Failed to retrieve active sessions", result.Errors);
        }

        [HttpDelete("session/{sessionId}")]
        public async Task<IActionResult> TerminateSession(string sessionId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new TerminateSessionCommand
            {
                SessionId = sessionId,
                TerminatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Session terminated successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Session not found");

            return BadRequest("Failed to terminate session", result.Errors);
        }

        [HttpPost("security-scan")]
        public async Task<IActionResult> InitiateSecurityScan()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new InitiateSecurityScanCommand { InitiatedBy = userGuid };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Security scan initiated successfully");

            return BadRequest("Failed to initiate security scan", result.Errors);
        }

        [HttpGet("security-scan/{scanId}")]
        [OutputCache(Duration = 60, Tags = new[] { "Security", "Scan" })]
        public async Task<IActionResult> GetSecurityScanResults(Guid scanId)
        {
            var query = new GetSecurityScanResultsQuery { ScanId = scanId };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Security scan results retrieved successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Security scan not found");

            return BadRequest("Failed to retrieve security scan results", result.Errors);
        }
    }
}