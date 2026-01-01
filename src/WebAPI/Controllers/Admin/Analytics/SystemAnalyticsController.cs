using Application.Features.Shared.Logging.Interfaces;
using Application.Features.Admin.Analytics.Queries;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Analytics
{
    [Route("api/v{version:apiVersion}/admin/analytics/system")]
    public class SystemAnalyticsController : BaseAnalyticsController
    {
        public SystemAnalyticsController(ILogger<SystemAnalyticsController> logger) : base(logger)
        {
        }

        /// <summary>
        /// Get system performance analytics
        /// </summary>
        [HttpGet]
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
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetSystemAnalytics");
            }
        }

        /// <summary>
        /// Get performance metrics
        /// </summary>
        [HttpGet("performance")]
        public async Task<IActionResult> GetPerformanceMetrics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "hour")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewPerformanceMetrics");

                var query = new GetSystemAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "cpu_usage", "memory_usage", "disk_usage", "network_traffic" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetPerformanceMetrics");
            }
        }

        /// <summary>
        /// Get API performance analytics
        /// </summary>
        [HttpGet("api")]
        public async Task<IActionResult> GetApiPerformance(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "hour")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewApiPerformance");

                var query = new GetSystemAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "api_response_time", "api_requests", "api_errors", "endpoint_performance" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetApiPerformance");
            }
        }

        /// <summary>
        /// Get database performance analytics
        /// </summary>
        [HttpGet("database")]
        public async Task<IActionResult> GetDatabasePerformance(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "hour")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewDatabasePerformance");

                var query = new GetSystemAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Granularity = granularity,
                    Metrics = new List<string> { "db_response_time", "db_connections", "query_performance", "cache_hit_rate" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetDatabasePerformance");
            }
        }

        /// <summary>
        /// Get system alerts
        /// </summary>
        [HttpGet("alerts")]
        public async Task<IActionResult> GetSystemAlerts(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string severity = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSystemAlerts");

                var metrics = new List<string> { "alerts", "warnings", "errors" };
                if (!string.IsNullOrEmpty(severity))
                    metrics.Add(severity);

                var query = new GetSystemAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Metrics = metrics
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetSystemAlerts");
            }
        }

        /// <summary>
        /// Get system health status
        /// </summary>
        [HttpGet("health")]
        public async Task<IActionResult> GetSystemHealth()
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSystemHealth");

                var query = new GetSystemAnalyticsQuery
                {
                    Metrics = new List<string> { "health_status", "uptime", "availability", "service_status" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetSystemHealth");
            }
        }

        /// <summary>
        /// Get error logs analytics
        /// </summary>
        [HttpGet("errors")]
        public async Task<IActionResult> GetErrorLogs(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string severity = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewErrorLogs");

                var metrics = new List<string> { "error_logs", "error_trends", "error_types" };
                if (!string.IsNullOrEmpty(severity))
                    metrics.Add(severity);

                var query = new GetSystemAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Metrics = metrics
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetErrorLogs");
            }
        }
    }
}
