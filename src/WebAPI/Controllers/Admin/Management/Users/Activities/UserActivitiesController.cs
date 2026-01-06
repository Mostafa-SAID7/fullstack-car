using Application.Features.Admin.Management.Users.Activities.Queries;
using Application.Features.Admin.Management.Users.Activities.Models;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Management.Users.Activities
{
    [Authorize(Roles = "Admin")]
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/users/{userId}/activities")]
    public class UserActivitiesController : BaseController
    {
        private readonly ILogger<UserActivitiesController> _logger;

        public UserActivitiesController(ILogger<UserActivitiesController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserActivities(
            Guid userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? activityType = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                _logger.LogInformation("Admin requested activities for user {UserId}", userId);

                var query = new GetUserActivityQuery
                {
                    UserId = userId,
                    Page = page,
                    PageSize = pageSize,
                    ActivityType = activityType,
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
                _logger.LogError(ex, "Error getting activities for user {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetUserActivitySummary(
            Guid userId,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                _logger.LogInformation("Admin requested activity summary for user {UserId}", userId);

                // This would be a new query for activity summary
                var query = new GetUserActivitySummaryQuery
                {
                    UserId = userId,
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
                _logger.LogError(ex, "Error getting activity summary for user {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("timeline")]
        public async Task<IActionResult> GetUserActivityTimeline(
            Guid userId,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] int limit = 50)
        {
            try
            {
                _logger.LogInformation("Admin requested activity timeline for user {UserId}", userId);

                var query = new GetUserActivityTimelineQuery
                {
                    UserId = userId,
                    FromDate = fromDate ?? DateTime.UtcNow.AddDays(-7),
                    ToDate = toDate ?? DateTime.UtcNow,
                    Limit = limit
                };

                var result = await Mediator.Send(query);

                if (result.Succeeded)
                    return Ok(result.Data);

                return BadRequest(result.Errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting activity timeline for user {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetUserActivityStats(
            Guid userId,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                _logger.LogInformation("Admin requested activity stats for user {UserId}", userId);

                var query = new GetUserActivityStatsQuery
                {
                    UserId = userId,
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
                _logger.LogError(ex, "Error getting activity stats for user {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
