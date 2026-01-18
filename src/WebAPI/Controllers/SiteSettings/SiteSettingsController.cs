using Application.Features.Admin.SiteSettings.Commands;
using Application.Features.Admin.SiteSettings.DTOs;
using Application.Features.Admin.SiteSettings.Queries;
using Application.Features.Admin.Security.Commands;
using Application.Features.Admin.Security.DTOs;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Asp.Versioning;

namespace WebAPI.Controllers.SiteSettings
{
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/site-settings")]
    public class SiteSettingsController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public SiteSettingsController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [OutputCache(Duration = 600, Tags = new[] { "SiteSettings" })]
        public async Task<IActionResult> GetSiteSettings()
        {
            var query = new GetSiteSettingsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Site settings retrieved successfully");

            return BadRequest("Failed to retrieve site settings", result.Errors);
        }

        [HttpGet("public")]
        [AllowAnonymous]
        [OutputCache(Duration = 1800, Tags = new[] { "SiteSettings", "Public" })]
        public async Task<IActionResult> GetPublicSiteSettings()
        {
            var query = new GetPublicSiteSettingsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Public site settings retrieved successfully");

            return BadRequest("Failed to retrieve public site settings", result.Errors);
        }

        [HttpPut("general")]
        public async Task<IActionResult> UpdateGeneralSettings([FromBody] UpdateGeneralSettingsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateGeneralSettingsCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "General settings updated successfully");

            return BadRequest("Failed to update general settings", result.Errors);
        }

        [HttpPut("security")]
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

        [HttpPut("email")]
        public async Task<IActionResult> UpdateEmailSettings([FromBody] UpdateEmailSettingsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateEmailSettingsCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Email settings updated successfully");

            return BadRequest("Failed to update email settings", result.Errors);
        }

        [HttpPut("seo")]
        public async Task<IActionResult> UpdateSeoSettings([FromBody] UpdateSeoSettingsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateSeoSettingsCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "SEO settings updated successfully");

            return BadRequest("Failed to update SEO settings", result.Errors);
        }

        [HttpPut("social-media")]
        public async Task<IActionResult> UpdateSocialMediaSettings([FromBody] UpdateSocialMediaSettingsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateSocialMediaSettingsCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Social media settings updated successfully");

            return BadRequest("Failed to update social media settings", result.Errors);
        }

        [HttpPut("maintenance")]
        public async Task<IActionResult> UpdateMaintenanceSettings([FromBody] UpdateMaintenanceSettingsRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new UpdateMaintenanceSettingsCommand
            {
                Request = request,
                UpdatedBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Maintenance settings updated successfully");

            return BadRequest("Failed to update maintenance settings", result.Errors);
        }

        [HttpPost("backup")]
        public async Task<IActionResult> CreateSettingsBackup()
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new CreateSettingsBackupCommand { CreatedBy = userGuid };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success(result.Data, "Settings backup created successfully");

            return BadRequest("Failed to create settings backup", result.Errors);
        }

        [HttpPost("restore/{backupId}")]
        public async Task<IActionResult> RestoreSettingsBackup(Guid backupId)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized("User authentication required");
            }

            if (!Guid.TryParse(_currentUserService.UserId, out var userGuid))
            {
                return Unauthorized("Invalid user context");
            }

            var command = new RestoreSettingsBackupCommand
            {
                BackupId = backupId,
                RestoredBy = userGuid
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Settings restored from backup successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Backup not found");

            return BadRequest("Failed to restore settings from backup", result.Errors);
        }

        [HttpGet("backups")]
        [OutputCache(Duration = 300, Tags = new[] { "SiteSettings", "Backups" })]
        public async Task<IActionResult> GetSettingsBackups(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetSettingsBackupsQuery
            {
                PageNumber = page,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Settings backups retrieved successfully");

            return BadRequest("Failed to retrieve settings backups", result.Errors);
        }

        [HttpDelete("backups/{backupId}")]
        public async Task<IActionResult> DeleteSettingsBackup(Guid backupId)
        {
            var command = new DeleteSettingsBackupCommand { BackupId = backupId };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Success("Settings backup deleted successfully");

            if (result.Errors.Any(e => e.Contains("not found")))
                return NotFound("Backup not found");

            return BadRequest("Failed to delete settings backup", result.Errors);
        }

        [HttpGet("audit-log")]
        [OutputCache(Duration = 60, Tags = new[] { "SiteSettings", "AuditLog" })]
        public async Task<IActionResult> GetSettingsAuditLog(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? settingCategory = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = new GetSettingsAuditLogQuery
            {
                PageNumber = page,
                PageSize = pageSize,
                SettingCategory = settingCategory,
                FromDate = fromDate,
                ToDate = toDate
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Success(result.Data, "Settings audit log retrieved successfully");

            return BadRequest("Failed to retrieve settings audit log", result.Errors);
        }
    }
}