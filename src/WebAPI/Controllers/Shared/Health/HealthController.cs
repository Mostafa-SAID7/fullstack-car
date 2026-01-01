using Application.Features.Shared.System.Interfaces;
using Application.Features.Shared.Logging.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace WebAPI.Controllers.Shared.Health
{

    [Route("api/v{version:apiVersion}/health")]
    public class HealthController : BaseController
    {
        private readonly HealthCheckService _healthCheckService;
        private readonly ILogger<HealthController> _logger;

        public HealthController(
            HealthCheckService healthCheckService,
            ILogger<HealthController> logger)
        {
            _healthCheckService = healthCheckService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetHealth()
        {
            try
            {
                var healthReport = await _healthCheckService.CheckHealthAsync();

                var response = new
                {
                    status = healthReport.Status.ToString(),
                    totalDuration = healthReport.TotalDuration.TotalMilliseconds,
                    results = healthReport.Entries.Select(entry => new
                    {
                        name = entry.Key,
                        status = entry.Value.Status.ToString(),
                        duration = entry.Value.Duration.TotalMilliseconds,
                        description = entry.Value.Description,
                        data = entry.Value.Data
                    })
                };

                var statusCode = healthReport.Status switch
                {
                    Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Healthy => 200,
                    Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Degraded => 200,
                    Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Unhealthy => 503,
                    _ => 500
                };

                _logger.LogSystemHealth("OverallHealth", healthReport.Status.ToString(), new
                {
                    TotalChecks = healthReport.Entries.Count,
                    HealthyChecks = healthReport.Entries.Count(e => e.Value.Status == Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Healthy),
                    DegradedChecks = healthReport.Entries.Count(e => e.Value.Status == Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Degraded),
                    UnhealthyChecks = healthReport.Entries.Count(e => e.Value.Status == Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Unhealthy),
                    TotalDuration = healthReport.TotalDuration.TotalMilliseconds
                });

                return StatusCode(statusCode, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking system health");
                return StatusCode(500, new { status = "Error", message = "Health check failed" });
            }
        }

        [HttpGet("ready")]
        public async Task<IActionResult> GetReadiness()
        {
            try
            {
                var healthReport = await _healthCheckService.CheckHealthAsync();
                var isReady = healthReport.Status == Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Healthy;

                var response = new
                {
                    ready = isReady,
                    status = healthReport.Status.ToString(),
                    checks = healthReport.Entries.Count,
                    timestamp = DateTime.UtcNow
                };

                return isReady ? Ok(response) : StatusCode(503, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking readiness");
                return StatusCode(503, new { ready = false, error = "Readiness check failed" });
            }
        }

        [HttpGet("live")]
        public IActionResult GetLiveness()
        {
            try
            {
                // Basic liveness check - if we can respond, we're alive
                var response = new
                {
                    alive = true,
                    timestamp = DateTime.UtcNow,
                    uptime = DateTime.UtcNow - System.Diagnostics.Process.GetCurrentProcess().StartTime.ToUniversalTime()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking liveness");
                return StatusCode(500, new { alive = false, error = "Liveness check failed" });
            }
        }

        [HttpGet("detailed")]
        public async Task<IActionResult> GetDetailedHealth()
        {
            try
            {
                var healthReport = await _healthCheckService.CheckHealthAsync();
                var process = System.Diagnostics.Process.GetCurrentProcess();

                var response = new
                {
                    status = healthReport.Status.ToString(),
                    totalDuration = healthReport.TotalDuration.TotalMilliseconds,
                    timestamp = DateTime.UtcNow,
                    system = new
                    {
                        machineName = Environment.MachineName,
                        osVersion = Environment.OSVersion.ToString(),
                        processorCount = Environment.ProcessorCount,
                        workingSet = process.WorkingSet64 / (1024 * 1024), // MB
                        privateMemory = process.PrivateMemorySize64 / (1024 * 1024), // MB
                        threadCount = process.Threads.Count,
                        handleCount = process.HandleCount,
                        uptime = DateTime.UtcNow - process.StartTime.ToUniversalTime(),
                        gcMemory = GC.GetTotalMemory(false) / (1024 * 1024) // MB
                    },
                    checks = healthReport.Entries.Select(entry => new
                    {
                        name = entry.Key,
                        status = entry.Value.Status.ToString(),
                        duration = entry.Value.Duration.TotalMilliseconds,
                        description = entry.Value.Description,
                        exception = entry.Value.Exception?.Message,
                        data = entry.Value.Data,
                        tags = entry.Value.Tags
                    }),
                    dependencies = new
                    {
                        database = healthReport.Entries.ContainsKey("database") ? 
                            healthReport.Entries["database"].Status.ToString() : "Not Configured",
                        cache = healthReport.Entries.ContainsKey("redis") ? 
                            healthReport.Entries["redis"].Status.ToString() : "Not Configured",
                        externalServices = healthReport.Entries
                            .Where(e => e.Key.StartsWith("external_"))
                            .ToDictionary(e => e.Key, e => e.Value.Status.ToString())
                    }
                };

                var statusCode = healthReport.Status switch
                {
                    Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Healthy => 200,
                    Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Degraded => 200,
                    Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Unhealthy => 503,
                    _ => 500
                };

                return StatusCode(statusCode, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting detailed health information");
                return StatusCode(500, new { status = "Error", message = "Detailed health check failed" });
            }
        }

        [HttpGet("metrics")]
        public async Task<IActionResult> GetMetrics()
        {
            try
            {
                var process = System.Diagnostics.Process.GetCurrentProcess();
                var startTime = process.StartTime.ToUniversalTime();
                var uptime = DateTime.UtcNow - startTime;

                var metrics = new
                {
                    timestamp = DateTime.UtcNow,
                    uptime = new
                    {
                        totalSeconds = uptime.TotalSeconds,
                        totalMinutes = uptime.TotalMinutes,
                        totalHours = uptime.TotalHours,
                        totalDays = uptime.TotalDays,
                        formatted = uptime.ToString(@"dd\.hh\:mm\:ss")
                    },
                    memory = new
                    {
                        workingSetMB = process.WorkingSet64 / (1024 * 1024),
                        privateMemoryMB = process.PrivateMemorySize64 / (1024 * 1024),
                        gcMemoryMB = GC.GetTotalMemory(false) / (1024 * 1024),
                        gen0Collections = GC.CollectionCount(0),
                        gen1Collections = GC.CollectionCount(1),
                        gen2Collections = GC.CollectionCount(2)
                    },
                    threads = new
                    {
                        count = process.Threads.Count,
                        handles = process.HandleCount
                    },
                    system = new
                    {
                        machineName = Environment.MachineName,
                        osVersion = Environment.OSVersion.ToString(),
                        processorCount = Environment.ProcessorCount,
                        is64BitProcess = Environment.Is64BitProcess,
                        is64BitOperatingSystem = Environment.Is64BitOperatingSystem,
                        clrVersion = Environment.Version.ToString()
                    }
                };

                _logger.LogSystemHealth("SystemMetrics", "Collected", metrics);

                return Ok(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error collecting system metrics");
                return StatusCode(500, new { error = "Failed to collect metrics" });
            }
        }
    }
}
