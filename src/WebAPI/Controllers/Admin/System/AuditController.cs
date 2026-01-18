using Application.Features.Admin.System.DTOs;
using Application.Features.Admin.System.Queries;
using Application.Features.Admin.System.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Admin.System
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/system/audit")]
    public class AuditController : BaseController
    {
        [HttpGet("logs")]
        public async Task<IActionResult> GetAuditLogs(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? action = null,
            [FromQuery] string? entityType = null,
            [FromQuery] Guid? userId = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string? ipAddress = null)
        {
            var query = new GetAuditLogsQuery
            {
                Page = page,
                PageSize = pageSize,
                Action = action,
                EntityType = entityType,
                UserId = userId,
                FromDate = fromDate,
                ToDate = toDate,
                IpAddress = ipAddress
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("logs/{id}")]
        public async Task<IActionResult> GetAuditLogById(Guid id)
        {
            var query = new GetAuditLogByIdQuery { AuditLogId = id };
            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetAuditStats(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = new GetAuditStatsQuery
            {
                FromDate = fromDate ?? DateTime.UtcNow.AddDays(-30),
                ToDate = toDate ?? DateTime.UtcNow
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("user-activity/{userId}")]
        public async Task<IActionResult> GetUserActivity(
            Guid userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = new Application.Features.Admin.System.Queries.GetUserActivityQuery
            {
                UserId = userId,
                Page = page,
                PageSize = pageSize,
                FromDate = fromDate,
                ToDate = toDate
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpGet("security-events")]
        public async Task<IActionResult> GetSecurityEvents(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? severity = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = new GetSecurityEventsQuery
            {
                Page = page,
                PageSize = pageSize,
                Severity = severity,
                FromDate = fromDate,
                ToDate = toDate
            };

            var result = await Mediator.Send(query);

            if (result.Succeeded)
                return Ok(result.Data);

            return BadRequest(result.Errors);
        }

        [HttpPost("export")]
        public async Task<IActionResult> ExportAuditLogs([FromBody] ExportAuditLogsRequest request)
        {
            var command = new ExportAuditLogsCommand
            {
                FromDate = request.FromDate,
                ToDate = request.ToDate,
                Format = request.Format,
                IncludeFilters = request.IncludeFilters
            };

            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new { Message = "Export initiated", ExportId = result.Data });

            return BadRequest(result.Errors);
        }
    }

    public class ExportAuditLogsRequest
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Format { get; set; } = "CSV"; // "CSV", "JSON", "Excel"
        public Dictionary<string, object> IncludeFilters { get; set; } = new();
    }
}


