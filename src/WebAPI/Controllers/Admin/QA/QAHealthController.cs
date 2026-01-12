using Application.Features.QA.DTOs;
using Infrastructure.Services.QA;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Asp.Versioning;
using Application.Features.Shared.Logging.Interfaces;

namespace WebAPI.Controllers.Admin.QA;

/// <summary>
/// QA Health Monitoring Controller
/// Provides comprehensive health monitoring endpoints for QA system
/// Follows existing admin controller patterns and integrates with existing monitoring infrastructure
/// </summary>
[Authorize(Roles = "Admin,Moderator")]
[ApiVersion("3.0")]
[Route("api/v{version:apiVersion}/admin/qa/health")]
public class QAHealthController : BaseController
{
    private readonly IQAHealthMonitoringService _healthMonitoringService;
    private readonly ILogger<QAHealthController> _logger;

    public QAHealthController(
        IQAHealthMonitoringService healthMonitoringService,
        ILogger<QAHealthController> logger)
    {
        _healthMonitoringService = healthMonitoringService;
        _logger = logger;
    }

    /// <summary>
    /// Get overall QA system health status
    /// </summary>
    /// <returns>QA system health information</returns>
    [HttpGet]
    public async Task<ActionResult<QASystemHealthDto>> GetSystemHealth()
    {
        try
        {
            _logger.LogInformation("Admin requested QA system health check");
            
            var health = await _healthMonitoringService.GetSystemHealthAsync();
            
            // Log health status for monitoring
            _logger.LogInformation("QA System Health Status: {Status} (Check Duration: {Duration}ms)", 
                health.Status, health.CheckDurationMs);

            return Ok(health);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving QA system health");
            return StatusCode(500, new { error = "Failed to retrieve system health", details = ex.Message });
        }
    }

    /// <summary>
    /// Get detailed QA performance metrics
    /// </summary>
    /// <returns>Comprehensive performance metrics for dashboard display</returns>
    [HttpGet("performance")]
    public async Task<ActionResult<QAPerformanceMetricsDto>> GetPerformanceMetrics()
    {
        try
        {
            _logger.LogInformation("Admin requested QA performance metrics");
            
            var metrics = await _healthMonitoringService.GetPerformanceMetricsAsync();
            
            return Ok(metrics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving QA performance metrics");
            return StatusCode(500, new { error = "Failed to retrieve performance metrics", details = ex.Message });
        }
    }

    /// <summary>
    /// Get active system alerts and warnings
    /// </summary>
    /// <returns>List of active system alerts</returns>
    [HttpGet("alerts")]
    public async Task<ActionResult<List<QASystemAlertDto>>> GetSystemAlerts()
    {
        try
        {
            _logger.LogInformation("Admin requested QA system alerts");
            
            var alerts = await _healthMonitoringService.GetSystemAlertsAsync();
            
            // Log critical alerts count for monitoring
            var criticalAlerts = alerts.Count(a => a.Severity == "Critical");
            if (criticalAlerts > 0)
            {
                _logger.LogWarning("QA System has {CriticalCount} critical alerts out of {TotalCount} total alerts", 
                    criticalAlerts, alerts.Count);
            }

            return Ok(alerts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving QA system alerts");
            return StatusCode(500, new { error = "Failed to retrieve system alerts", details = ex.Message });
        }
    }

    /// <summary>
    /// Get user satisfaction metrics
    /// </summary>
    /// <returns>User satisfaction and engagement metrics</returns>
    [HttpGet("satisfaction")]
    public async Task<ActionResult<QAUserSatisfactionDto>> GetUserSatisfaction()
    {
        try
        {
            _logger.LogInformation("Admin requested QA user satisfaction metrics");
            
            var satisfaction = await _healthMonitoringService.GetUserSatisfactionMetricsAsync();
            
            return Ok(satisfaction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving QA user satisfaction metrics");
            return StatusCode(500, new { error = "Failed to retrieve satisfaction metrics", details = ex.Message });
        }
    }

    /// <summary>
    /// Get complete health dashboard data
    /// </summary>
    /// <returns>Complete dashboard data combining all health metrics</returns>
    [HttpGet("dashboard")]
    public async Task<ActionResult<QAHealthDashboardDto>> GetHealthDashboard()
    {
        try
        {
            _logger.LogInformation("Admin requested complete QA health dashboard");
            
            // Gather all health data in parallel for better performance
            var healthTask = _healthMonitoringService.GetSystemHealthAsync();
            var performanceTask = _healthMonitoringService.GetPerformanceMetricsAsync();
            var alertsTask = _healthMonitoringService.GetSystemAlertsAsync();
            var satisfactionTask = _healthMonitoringService.GetUserSatisfactionMetricsAsync();

            await Task.WhenAll(healthTask, performanceTask, alertsTask, satisfactionTask);

            var dashboard = new QAHealthDashboardDto
            {
                SystemHealth = healthTask.Result,
                PerformanceMetrics = performanceTask.Result,
                ActiveAlerts = alertsTask.Result,
                UserSatisfaction = satisfactionTask.Result,
                ExpertHealth = new QAExpertHealthDto(), // Placeholder - would be populated from expert service
                LastUpdated = DateTime.UtcNow,
                OverallStatus = DetermineOverallStatus(healthTask.Result, alertsTask.Result)
            };

            return Ok(dashboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving QA health dashboard");
            return StatusCode(500, new { error = "Failed to retrieve health dashboard", details = ex.Message });
        }
    }

    /// <summary>
    /// Trigger manual health check
    /// </summary>
    /// <returns>Success confirmation</returns>
    [HttpPost("check")]
    public async Task<ActionResult> TriggerHealthCheck()
    {
        try
        {
            _logger.LogInformation("Admin triggered manual QA health check");
            
            await _healthMonitoringService.TriggerHealthCheckAsync();
            
            return Ok(new { message = "Health check triggered successfully", timestamp = DateTime.UtcNow });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error triggering QA health check");
            return StatusCode(500, new { error = "Failed to trigger health check", details = ex.Message });
        }
    }

    /// <summary>
    /// Record custom performance metric
    /// </summary>
    /// <param name="request">Performance metric data</param>
    /// <returns>Success confirmation</returns>
    [HttpPost("metrics")]
    public async Task<ActionResult> RecordPerformanceMetric([FromBody] RecordMetricRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.MetricName))
            {
                return BadRequest(new { error = "MetricName is required" });
            }

            _logger.LogInformation("Admin recording custom QA performance metric: {MetricName} = {Value}", 
                request.MetricName, request.Value);
            
            await _healthMonitoringService.RecordPerformanceMetricAsync(
                request.MetricName, 
                request.Value, 
                request.Category ?? "Custom");
            
            return Ok(new { message = "Performance metric recorded successfully", timestamp = DateTime.UtcNow });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recording QA performance metric");
            return StatusCode(500, new { error = "Failed to record performance metric", details = ex.Message });
        }
    }

    /// <summary>
    /// Get system health summary for quick status check
    /// </summary>
    /// <returns>Quick health summary</returns>
    [HttpGet("summary")]
    public async Task<ActionResult<QAHealthSummaryDto>> GetHealthSummary()
    {
        try
        {
            var health = await _healthMonitoringService.GetSystemHealthAsync();
            var alerts = await _healthMonitoringService.GetSystemAlertsAsync();

            var summary = new QAHealthSummaryDto
            {
                OverallStatus = health.Status,
                TotalQuestions = health.Metrics?.TotalQuestions ?? 0,
                TotalAnswers = health.Metrics?.TotalAnswers ?? 0,
                ActiveUsers = health.Metrics?.ActiveUsers ?? 0,
                ResponseRate = health.Metrics?.ResponseRate ?? 0,
                ActiveAlerts = alerts.Count(a => a.IsActive),
                CriticalAlerts = alerts.Count(a => a.IsActive && a.Severity == "Critical"),
                LastChecked = health.Timestamp
            };

            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving QA health summary");
            return StatusCode(500, new { error = "Failed to retrieve health summary", details = ex.Message });
        }
    }

    #region Private Helper Methods

    private string DetermineOverallStatus(QASystemHealthDto health, List<QASystemAlertDto> alerts)
    {
        var criticalAlerts = alerts.Count(a => a.IsActive && a.Severity == "Critical");
        var warningAlerts = alerts.Count(a => a.IsActive && a.Severity == "Warning");

        if (health.Status == "Critical" || criticalAlerts > 0)
            return "Critical";
        
        if (health.Status == "Warning" || warningAlerts > 0)
            return "Warning";
        
        return "Healthy";
    }

    #endregion
}

/// <summary>
/// Request DTO for recording custom performance metrics
/// </summary>
public class RecordMetricRequest
{
    public string MetricName { get; set; } = string.Empty;
    public double Value { get; set; }
    public string? Category { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}

/// <summary>
/// QA Health Summary DTO for quick status checks
/// </summary>
public class QAHealthSummaryDto
{
    public string OverallStatus { get; set; } = string.Empty;
    public int TotalQuestions { get; set; }
    public int TotalAnswers { get; set; }
    public int ActiveUsers { get; set; }
    public double ResponseRate { get; set; }
    public int ActiveAlerts { get; set; }
    public int CriticalAlerts { get; set; }
    public DateTime LastChecked { get; set; }
}