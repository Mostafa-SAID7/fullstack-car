using Application.Features.Shared.Logging.Interfaces;
using Application.Features.Admin.Analytics.Queries;
using Application.Features.Admin.Analytics.DTOs.Requests;
using Application.Features.Admin.Analytics.DTOs.Responses;
using Application.Features.Admin.Analytics.Commands;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Analytics
{
    [Authorize(Roles = "Admin")]

    [Route("api/v{version:apiVersion}/admin/analytics")]
    public class AnalyticsController : BaseController
    {
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(ILogger<AnalyticsController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Get comprehensive admin analytics
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAnalytics([FromQuery] GetAdvancedAnalyticsQuery query)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewAdvancedAnalytics", query);
                
                var analytics = await Mediator.Send(query);
                
                if (analytics.Succeeded)
                    return Ok(analytics.Data);

                return BadRequest(analytics.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting advanced analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get user analytics data
        /// </summary>
        [HttpGet("users")]
        public async Task<IActionResult> GetUserAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewUserAnalytics");

                var query = new GetUserAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "users", "growth", "retention", "churn" }
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get content analytics data
        /// </summary>
        [HttpGet("content")]
        public async Task<IActionResult> GetContentAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewContentAnalytics");

                var query = new GetContentAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "posts", "comments", "groups", "reviews" }
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting content analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get engagement analytics data
        /// </summary>
        [HttpGet("engagement")]
        public async Task<IActionResult> GetEngagementAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewEngagementAnalytics");

                var query = new GetEngagementAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "views", "likes", "shares", "engagement_rate" }
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting engagement analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get system performance analytics
        /// </summary>
        [HttpGet("system")]
        public async Task<IActionResult> GetSystemAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "hour")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSystemAnalytics");

                var query = new GetSystemAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "response_time", "error_rate", "requests", "uptime" }
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get security analytics data
        /// </summary>
        [HttpGet("security")]
        public async Task<IActionResult> GetSecurityAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSecurityAnalytics");

                var query = new GetSecurityAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Metrics = new List<string> { "security_events", "failed_logins", "blocked_ips", "threats" }
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting security analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Export analytics data in various formats
        /// </summary>
        [HttpPost("export")]
        public async Task<IActionResult> ExportAnalytics([FromBody] ExportAnalyticsRequest request)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ExportAnalytics", request);

                var command = new ExportAnalyticsCommand
                {
                    Request = request,
                    AdminId = Guid.Parse(GetCurrentUserId())
                };

                var result = await Mediator.Send(command);

                if (result.Succeeded)
                    return Ok(new { Message = "Export request processed", Export = result.Data });

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting analytics");
                return StatusCode(500, "Internal server error");
            }
        }

        private string GetCurrentUserId()
        {
            return User?.FindFirst("sub")?.Value ?? User?.FindFirst("id")?.Value ?? "Unknown";
        }
    }
}
