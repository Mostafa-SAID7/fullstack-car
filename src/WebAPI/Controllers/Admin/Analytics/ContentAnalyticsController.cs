using Application.Features.Shared.Logging.Interfaces;
using Application.Features.Admin.Analytics.Queries;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Analytics
{
    [Route("api/v{version:apiVersion}/admin/analytics/content")]
    public class ContentAnalyticsController : BaseAnalyticsController
    {
        public ContentAnalyticsController(IAdvancedLogger<ContentAnalyticsController> logger) : base(logger)
        {
        }

        /// <summary>
        /// Get content analytics data
        /// </summary>
        [HttpGet]
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
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetContentAnalytics");
            }
        }

        /// <summary>
        /// Get posts analytics
        /// </summary>
        [HttpGet("posts")]
        public async Task<IActionResult> GetPostsAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewPostsAnalytics");

                var query = new GetContentAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "posts", "post_views", "post_engagement" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetPostsAnalytics");
            }
        }

        /// <summary>
        /// Get comments analytics
        /// </summary>
        [HttpGet("comments")]
        public async Task<IActionResult> GetCommentsAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewCommentsAnalytics");

                var query = new GetContentAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "comments", "comment_trends", "comment_sentiment" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetCommentsAnalytics");
            }
        }

        /// <summary>
        /// Get groups analytics
        /// </summary>
        [HttpGet("groups")]
        public async Task<IActionResult> GetGroupsAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewGroupsAnalytics");

                var query = new GetContentAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Metrics = new List<string> { "groups", "group_members", "group_activity" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetGroupsAnalytics");
            }
        }

        /// <summary>
        /// Get content categories analytics
        /// </summary>
        [HttpGet("categories")]
        public async Task<IActionResult> GetContentCategories(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewContentCategories");

                var query = new GetContentAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Metrics = new List<string> { "categories", "category_trends", "popular_topics" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetContentCategories");
            }
        }

        /// <summary>
        /// Get popular content
        /// </summary>
        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularContent(
            [FromQuery] int limit = 10,
            [FromQuery] string timeframe = "week")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewPopularContent");

                var query = new GetContentAnalyticsQuery
                {
                    Metrics = new List<string> { "popular_content", "trending", timeframe }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetPopularContent");
            }
        }
    }
}