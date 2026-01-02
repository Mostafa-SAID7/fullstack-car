using Application.Features.Shared.Logging.Interfaces;
using Application.Features.Admin.Analytics.Queries;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Analytics
{
    [ApiVersion("3.0")]
    [Route("api/v{version:apiVersion}/admin/analytics/engagement")]
    public class EngagementAnalyticsController : BaseAnalyticsController
    {
        public EngagementAnalyticsController(ILogger<EngagementAnalyticsController> logger) : base(logger)
        {
        }

        /// <summary>
        /// Get engagement analytics data
        /// </summary>
        [HttpGet]
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
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetEngagementAnalytics");
            }
        }

        /// <summary>
        /// Get likes analytics
        /// </summary>
        [HttpGet("likes")]
        public async Task<IActionResult> GetLikesAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewLikesAnalytics");

                var query = new GetEngagementAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "likes", "like_trends", "like_distribution" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetLikesAnalytics");
            }
        }

        /// <summary>
        /// Get views analytics
        /// </summary>
        [HttpGet("views")]
        public async Task<IActionResult> GetViewsAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewViewsAnalytics");

                var query = new GetEngagementAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "views", "view_trends", "unique_views" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetViewsAnalytics");
            }
        }

        /// <summary>
        /// Get shares analytics
        /// </summary>
        [HttpGet("shares")]
        public async Task<IActionResult> GetSharesAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSharesAnalytics");

                var query = new GetEngagementAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "shares", "share_trends", "viral_content" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetSharesAnalytics");
            }
        }

        /// <summary>
        /// Get engagement rates
        /// </summary>
        [HttpGet("rates")]
        public async Task<IActionResult> GetEngagementRates(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewEngagementRates");

                var query = new GetEngagementAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "engagement_rate", "interaction_rate", "conversion_rate" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetEngagementRates");
            }
        }

        /// <summary>
        /// Get top engaged content
        /// </summary>
        [HttpGet("top")]
        public async Task<IActionResult> GetTopEngagedContent(
            [FromQuery] int limit = 10,
            [FromQuery] string timeframe = "week")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewTopEngagedContent");

                var query = new GetEngagementAnalyticsQuery
                {
                    Metrics = new List<string> { "top_engaged", "most_liked", "most_shared", timeframe }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetTopEngagedContent");
            }
        }

        /// <summary>
        /// Get engagement trends
        /// </summary>
        [HttpGet("trends")]
        public async Task<IActionResult> GetEngagementTrends(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewEngagementTrends");

                var query = new GetEngagementAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "trends", "growth_rate", "seasonal_patterns" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetEngagementTrends");
            }
        }
    }
}
