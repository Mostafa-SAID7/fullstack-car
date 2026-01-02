using Application.Features.Shared.Logging.Interfaces;
using Application.Features.Admin.Analytics.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Analytics
{
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/analytics/users")]
    public class UserAnalyticsController : BaseAnalyticsController
    {
        public UserAnalyticsController(ILogger<UserAnalyticsController> logger) : base(logger)
        {
        }

        /// <summary>
        /// Get user analytics data
        /// </summary>
        [HttpGet]
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
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetUserAnalytics");
            }
        }

        /// <summary>
        /// Get user demographics data
        /// </summary>
        [HttpGet("demographics")]
        public async Task<IActionResult> GetUserDemographics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewUserDemographics");

                var query = new GetUserAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Metrics = new List<string> { "demographics", "age_groups", "locations" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetUserDemographics");
            }
        }

        /// <summary>
        /// Get user activity trends
        /// </summary>
        [HttpGet("activity")]
        public async Task<IActionResult> GetUserActivity(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewUserActivity");

                var query = new GetUserAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "activity", "sessions", "page_views" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetUserActivity");
            }
        }

        /// <summary>
        /// Get top users by engagement
        /// </summary>
        [HttpGet("top")]
        public async Task<IActionResult> GetTopUsers(
            [FromQuery] int limit = 10,
            [FromQuery] string sortBy = "engagement")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewTopUsers");

                var query = new GetUserAnalyticsQuery
                {
                    Metrics = new List<string> { "top_users", sortBy }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetTopUsers");
            }
        }
    }
}
