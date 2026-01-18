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
    [Route("api/v{version:apiVersion}/admin/system/backups")]
    public class BackupController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;

        public BackupController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<IActionResult> GetBackups(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? type = null,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = new GetBackupsQuery
            {
                Page = page,
                PageSize = pageSize,
                Type = type,
                Status = status,
                FromDate = fromDate,
                ToDate = toDate
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBackup(Guid id)
        {
            var query = new GetBackupByIdQuery { BackupId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBackup([FromBody] CreateBackupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new CreateBackupCommand
            {
                AdminId = Guid.Parse(_currentUserService.UserId),
                Name = request.Name,
                Type = request.Type,
                IncludeFiles = request.IncludeFiles,
                CompressBackup = request.CompressBackup,
                Description = request.Description
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return CreatedAtAction(nameof(GetBackup), new { id = result.Data }, result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("{id}/restore")]
        public async Task<IActionResult> RestoreBackup(Guid id, [FromBody] RestoreBackupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new RestoreBackupCommand
            {
                BackupId = id,
                AdminId = Guid.Parse(_currentUserService.UserId),
                RestoreType = request.RestoreType,
                TargetLocation = request.TargetLocation,
                OverwriteExisting = request.OverwriteExisting
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Backup restore initiated", RestoreId = result.Data });

            return BadRequest(result.Errors);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBackup(Guid id)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new DeleteBackupCommand
            {
                BackupId = id,
                AdminId = Guid.Parse(_currentUserService.UserId)
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return NoContent();

            return BadRequest(result.Errors);
        }

        [HttpPost("schedule")]
        public async Task<IActionResult> ScheduleBackup([FromBody] ScheduleBackupRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new ScheduleBackupCommand
            {
                AdminId = Guid.Parse(_currentUserService.UserId),
                Name = request.Name,
                Type = request.Type,
                Schedule = request.Schedule,
                RetentionDays = request.RetentionDays,
                IsActive = request.IsActive
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Backup scheduled successfully", ScheduleId = result.Data });

            return BadRequest(result.Errors);
        }

        [HttpGet("schedules")]
        public async Task<IActionResult> GetBackupSchedules()
        {
            var query = new GetBackupSchedulesQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPut("schedules/{id}")]
        public async Task<IActionResult> UpdateBackupSchedule(Guid id, [FromBody] UpdateBackupScheduleRequest request)
        {
            if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
            {
                return Unauthorized();
            }

            var command = new UpdateBackupScheduleCommand
            {
                ScheduleId = id,
                AdminId = Guid.Parse(_currentUserService.UserId),
                Schedule = request.Schedule,
                RetentionDays = request.RetentionDays,
                IsActive = request.IsActive
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Backup schedule updated successfully" });

            return BadRequest(result.Errors);
        }

        [HttpGet("storage-usage")]
        public async Task<IActionResult> GetStorageUsage()
        {
            var query = new GetBackupStorageUsageQuery();
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }
    }

    public class RestoreBackupRequest
    {
        public string RestoreType { get; set; } = "Full"; // "Full", "Selective"
        public string? TargetLocation { get; set; }
        public bool OverwriteExisting { get; set; } = false;
    }

    public class ScheduleBackupRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "Full";
        public string Schedule { get; set; } = string.Empty; // Cron expression
        public int RetentionDays { get; set; } = 30;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateBackupScheduleRequest
    {
        public string Schedule { get; set; } = string.Empty;
        public int RetentionDays { get; set; } = 30;
        public bool IsActive { get; set; } = true;
    }
}


