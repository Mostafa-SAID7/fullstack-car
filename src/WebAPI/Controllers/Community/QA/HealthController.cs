using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;

namespace WebAPI.Controllers.Community.QA
{
    /// <summary>
    /// QA Health API controller serving both Angular and React frontends
    /// Provides health monitoring and metrics for the QA system
    /// </summary>
    [Authorize]
    [ApiVersion("7.0")]
    [Route("api/v{version:apiVersion}/qa/health")]
    public class HealthController : BaseController
    {
        private readonly ILogger<HealthController> _logger;

        public HealthController(ILogger<HealthController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Get QA system health metrics
        /// Used by React Dashboard for system monitoring
        /// </summary>
        /// <returns>System health metrics</returns>
        [HttpGet("metrics")]
        public async Task<IActionResult> GetHealthMetrics()
        {
            try
            {
                // Return mock health metrics for now
                var healthMetrics = new
                {
                    Status = "Healthy",
                    DatabaseStatus = "Connected",
                    SignalRStatus = "Active",
                    SearchStatus = "Operational",
                    ResponseTime = "150ms",
                    ActiveConnections = 0,
                    QueueLength = 0,
                    LastUpdated = DateTime.UtcNow
                };

                return Ok(healthMetrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving health metrics");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}