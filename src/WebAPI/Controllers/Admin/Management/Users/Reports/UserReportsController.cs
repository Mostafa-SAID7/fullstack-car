using Application.Features.Admin.Management.Users.Reports.Queries;
using Application.Features.Admin.Management.Users.Reports.Commands;
using Application.Features.Admin.Management.Users.Reports.DTOs.Requests;
using Application.Features.Admin.Management.Users.Reports.Models;
using Application.Features.Identity.Core.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Management.Users.Reports
{
    [Authorize(Roles = "Admin,Moderator")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/users/reports")]
    public class UserReportsController : BaseController
    {
        private readonly ILogger<UserReportsController> _logger;
        private readonly ICurrentUserService _currentUserService;

        public UserReportsController(
            ILogger<UserReportsController> logger,
            ICurrentUserService currentUserService)
        {
            _logger = logger;
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserReports(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] Guid? reportedUserId = null,
            [FromQuery] Guid? reporterId = null,
            [FromQuery] string? category = null,
            [FromQuery] bool? isResolved = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                _logger.LogInformation("Admin requested user reports list");

                var query = new GetUserReportsQuery
                {
                    Page = page,
                    PageSize = pageSize,
                    ReportedUserId = reportedUserId,
                    ReporterId = reporterId,
                    Category = category,
                    IsResolved = isResolved,
                    FromDate = fromDate,
                    ToDate = toDate
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user reports");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserReport(Guid id)
        {
            try
            {
                _logger.LogInformation("Admin requested user report {ReportId}", id);

                var query = new GetUserReportByIdQuery { ReportId = id };
                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user report {ReportId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetReportsForUser(
            Guid userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? isResolved = null)
        {
            try
            {
                _logger.LogInformation("Admin requested reports for user {UserId}", userId);

                var query = new GetUserReportsQuery
                {
                    Page = page,
                    PageSize = pageSize,
                    ReportedUserId = userId,
                    IsResolved = isResolved
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reports for user {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("{id}/resolve")]
        public async Task<IActionResult> ResolveReport(Guid id, [FromBody] ResolveReportRequest request)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                {
                    return Unauthorized();
                }

                _logger.LogInformation("Admin {AdminId} resolving report {ReportId}", GetCurrentUserId(), id);

                var command = new ResolveUserReportCommand
                {
                    ReportId = id,
                    AdminId = Guid.Parse(_currentUserService.UserId),
                    Resolution = request.Resolution,
                    Notes = request.Notes,
                    ActionTaken = request.ActionTaken
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resolving report {ReportId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("{id}/dismiss")]
        public async Task<IActionResult> DismissReport(Guid id, [FromBody] DismissReportRequest request)
        {
            try
            {
                if (!_currentUserService.IsAuthenticated || string.IsNullOrEmpty(_currentUserService.UserId))
                {
                    return Unauthorized();
                }

                _logger.LogInformation("Admin {AdminId} dismissing report {ReportId}", GetCurrentUserId(), id);

                var command = new DismissUserReportCommand
                {
                    ReportId = id,
                    AdminId = Guid.Parse(_currentUserService.UserId),
                    Reason = request.Reason
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error dismissing report {ReportId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("statistics")]
        public async Task<IActionResult> GetReportStatistics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                _logger.LogInformation("Admin requested report statistics");

                var query = new GetUserReportStatisticsQuery
                {
                    FromDate = fromDate ?? DateTime.UtcNow.AddDays(-30),
                    ToDate = toDate ?? DateTime.UtcNow
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting report statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Unknown";
        }
    }
}


