using Application.Features.Shared.Logging.Interfaces;
using Application.Features.Admin.Analytics.Queries;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Admin.Analytics
{
    [Route("api/v{version:apiVersion}/admin/analytics/security")]
    public class SecurityAnalyticsController : BaseAnalyticsController
    {
        public SecurityAnalyticsController(IAdvancedLogger<SecurityAnalyticsController> logger) : base(logger)
        {
        }

        /// <summary>
        /// Get security analytics data
        /// </summary>
        [HttpGet]
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
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetSecurityAnalytics");
            }
        }

        /// <summary>
        /// Get failed login attempts analytics
        /// </summary>
        [HttpGet("failed-logins")]
        public async Task<IActionResult> GetFailedLogins(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewFailedLogins");

                var query = new GetSecurityAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Metrics = new List<string> { "failed_logins", "login_attempts", "brute_force_attacks" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetFailedLogins");
            }
        }

        /// <summary>
        /// Get security threats analytics
        /// </summary>
        [HttpGet("threats")]
        public async Task<IActionResult> GetSecurityThreats(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string severity = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSecurityThreats");

                var metrics = new List<string> { "threats", "threat_types", "threat_sources" };
                if (!string.IsNullOrEmpty(severity))
                    metrics.Add(severity);

                var query = new GetSecurityAnalyticsQuery
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
                return HandleException(ex, "GetSecurityThreats");
            }
        }

        /// <summary>
        /// Get blocked IPs analytics
        /// </summary>
        [HttpGet("blocked-ips")]
        public async Task<IActionResult> GetBlockedIPs(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewBlockedIPs");

                var query = new GetSecurityAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Metrics = new List<string> { "blocked_ips", "ip_blacklist", "geographic_blocks" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetBlockedIPs");
            }
        }

        /// <summary>
        /// Get security incidents analytics
        /// </summary>
        [HttpGet("incidents")]
        public async Task<IActionResult> GetSecurityIncidents(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string status = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSecurityIncidents");

                var metrics = new List<string> { "incidents", "incident_types", "incident_resolution" };
                if (!string.IsNullOrEmpty(status))
                    metrics.Add(status);

                var query = new GetSecurityAnalyticsQuery
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
                return HandleException(ex, "GetSecurityIncidents");
            }
        }

        /// <summary>
        /// Get security events analytics
        /// </summary>
        [HttpGet("events")]
        public async Task<IActionResult> GetSecurityEvents(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string eventType = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSecurityEvents");

                var metrics = new List<string> { "security_events", "event_timeline", "event_patterns" };
                if (!string.IsNullOrEmpty(eventType))
                    metrics.Add(eventType);

                var query = new GetSecurityAnalyticsQuery
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
                return HandleException(ex, "GetSecurityEvents");
            }
        }

        /// <summary>
        /// Get authentication analytics
        /// </summary>
        [HttpGet("authentication")]
        public async Task<IActionResult> GetAuthenticationAnalytics(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string granularity = "day")
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewAuthenticationAnalytics");

                var query = new GetSecurityAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Metrics = new List<string> { "authentication", "login_success", "login_failures", "session_analytics" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetAuthenticationAnalytics");
            }
        }

        /// <summary>
        /// Get suspicious activities analytics
        /// </summary>
        [HttpGet("suspicious")]
        public async Task<IActionResult> GetSuspiciousActivities(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            try
            {
                _logger.LogUserAction(GetCurrentUserId(), "ViewSuspiciousActivities");

                var query = new GetSecurityAnalyticsQuery
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    Metrics = new List<string> { "suspicious_activities", "anomaly_detection", "risk_assessment" }
                };

                var result = await Mediator.Send(query);
                return HandleResult(result);
            }
            catch (Exception ex)
            {
                return HandleException(ex, "GetSuspiciousActivities");
            }
        }
    }
}