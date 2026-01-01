using Application.Common.Interfaces.Data;
using Application.Common.Interfaces;
using Application.Features.Shared.Logging.Interfaces;
using Application.Features.Admin.Dashboard.Queries;
using Application.Features.Admin.Dashboard.DTOs;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Dashboard
{
    [Authorize(Roles = "Admin")]

    [Route("api/v{version:apiVersion}/admin/dashboard")]
    public class DashboardController : BaseController
    {
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(ILogger<DashboardController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Get comprehensive dashboard statistics
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetDashboard([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewAdminDashboard");

                var query = new GetDashboardStatsQuery
                {
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
                _logger.LogError(ex, "Error getting admin dashboard");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get system information and health status
        /// </summary>
        [HttpGet("system-info")]
        public async Task<IActionResult> GetSystemInfo()
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSystemInfo");

                var query = new GetSystemInfoQuery();
                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system info");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get recent system activity
        /// </summary>
        [HttpGet("recent-activity")]
        public async Task<IActionResult> GetRecentActivity(
            [FromQuery] int limit = 10,
            [FromQuery] string? activityType = null,
            [FromQuery] DateTime? fromDate = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewRecentActivity", new { Limit = limit });

                var query = new GetRecentActivityQuery
                {
                    Limit = limit,
                    ActivityType = activityType,
                    FromDate = fromDate
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(new { Activities = result.Data, TotalCount = result.Data?.Count ?? 0 });

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting recent activity");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get system alerts categorized by severity
        /// </summary>
        [HttpGet("alerts")]
        public async Task<IActionResult> GetSystemAlerts(
            [FromQuery] string? severity = null,
            [FromQuery] bool includeAcknowledged = false)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSystemAlerts");

                var query = new GetSystemAlertsQuery
                {
                    Severity = severity,
                    IncludeAcknowledged = includeAcknowledged
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system alerts");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get detailed performance metrics
        /// </summary>
        [HttpGet("performance")]
        public async Task<IActionResult> GetPerformanceMetrics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string granularity = "hour")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewPerformanceMetrics");

                var query = new GetPerformanceMetricsQuery
                {
                    FromDate = fromDate,
                    ToDate = toDate,
                    Granularity = granularity
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting performance metrics");
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Unknown";
        }
    }
}
