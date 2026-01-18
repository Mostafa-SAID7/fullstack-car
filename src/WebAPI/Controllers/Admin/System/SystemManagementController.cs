using Application.Features.Admin.System.DTOs;
using Application.Features.Admin.System.Commands;
using Application.Features.Admin.System.Queries;
using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Admin.System
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/system")]
    public class SystemManagementController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public SystemManagementController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet("health")]
        public async Task<IActionResult> GetSystemHealth()
        {
            var query = new GetSystemHealthQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("configuration")]
        public async Task<IActionResult> GetSystemConfiguration()
        {
            var query = new GetSystemConfigurationQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("alerts")]
        public async Task<IActionResult> GetSystemAlerts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? severity = null,
            [FromQuery] bool? acknowledged = null)
        {
            var query = new Application.Features.Admin.System.Queries.GetSystemAlertsQuery
            {
                Page = page,
                PageSize = pageSize,
                Severity = severity,
                Acknowledged = acknowledged
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPut("alerts/{id}/acknowledge")]
        public async Task<IActionResult> AcknowledgeAlert(Guid id, [FromBody] AcknowledgeAlertRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new AcknowledgeAlertCommand
            {
                AlertId = id,
                AdminId = Guid.Parse(_currentUserService.UserId),
                Notes = request.Notes
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Alert acknowledged successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("feature-flags")]
        public async Task<IActionResult> GetFeatureFlags()
        {
            var query = new GetFeatureFlagsQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPut("feature-flags/{name}/toggle")]
        public async Task<IActionResult> ToggleFeatureFlag(string name, [FromBody] ToggleFeatureFlagRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new ToggleFeatureFlagCommand
            {
                FlagName = name,
                IsEnabled = request.IsEnabled,
                AdminId = Guid.Parse(_currentUserService.UserId),
                Reason = request.Reason
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = $"Feature flag '{name}' {(request.IsEnabled ? "enabled" : "disabled")} successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPut("settings")]
        public async Task<IActionResult> UpdateSystemSetting([FromBody] UpdateSystemSettingRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new UpdateSystemSettingCommand
            {
                AdminId = Guid.Parse(_currentUserService.UserId),
                Key = request.Key,
                Value = request.Value,
                Category = request.Category,
                Description = request.Description
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "System setting updated successfully" });

            return BadRequest(result.Errors);
        }

        [HttpPost("maintenance")]
        public async Task<IActionResult> ScheduleMaintenance([FromBody] SystemMaintenanceRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new ScheduleMaintenanceCommand
            {
                AdminId = Guid.Parse(_currentUserService.UserId),
                Type = request.Type,
                ScheduledTime = request.ScheduledTime,
                Reason = request.Reason,
                NotifyUsers = request.NotifyUsers,
                EstimatedDurationMinutes = request.EstimatedDurationMinutes
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Maintenance scheduled successfully", MaintenanceId = result.Data });

            return BadRequest(result.Errors);
        }

        [HttpGet("audit-logs")]
        public async Task<IActionResult> GetAuditLogs(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? action = null,
            [FromQuery] string? entityType = null,
            [FromQuery] Guid? userId = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = new GetAuditLogsQuery
            {
                Page = page,
                PageSize = pageSize,
                Action = action,
                EntityType = entityType,
                UserId = userId,
                FromDate = fromDate,
                ToDate = toDate
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("services/status")]
        public async Task<IActionResult> GetServicesStatus()
        {
            var query = new GetServicesStatusQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
    }
}


