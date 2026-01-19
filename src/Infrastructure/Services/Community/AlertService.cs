using Application.Features.QA.DTOs;
using Infrastructure.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Hosting;
using Infrastructure.Common;

namespace Infrastructure.Services.QA;
public interface IAlertService
{
    Task SendHealthAlertAsync(SystemAlertDto alert);
    Task SendPerformanceAlertAsync(string metricName, double value, double threshold, string severity);
    Task SendExpertAvailabilityAlertAsync(string category, int availableExperts, int minimumRequired);
    Task SendSystemStatusChangeAsync(string oldStatus, string newStatus, string reason);
    Task NotifyAdministratorsAsync(string title, string message, string severity = "Info");
}

public class AlertService : IAlertService
{
    private readonly IHubContext<NotificationHub> _notificationHub;
    private readonly ILogger<AlertService> _logger;
    private readonly AnalyticsSettings _analyticsSettings;

    public AlertService(
        IHubContext<NotificationHub> notificationHub,
        ILogger<AlertService> logger,
        IOptions<AnalyticsSettings> analyticsSettings)
    {
        _notificationHub = notificationHub;
        _logger = logger;
        _analyticsSettings = analyticsSettings.Value;
    }

    public async Task SendHealthAlertAsync(SystemAlertDto alert)
    {
        try
        {
            _logger.LogInformation("Sending health alert: {Title} (Severity: {Severity})", 
                alert.Title, alert.Severity);

            // Send to admin group following existing notification patterns
            await _notificationHub.Clients.Group("admin").SendAsync("ReceiveHealthAlert", new
            {
                Id = alert.Id,
                Type = "HealthAlert",
                Title = alert.Title,
                Message = alert.Message,
                Severity = alert.Severity,
                Category = alert.Category,
                Timestamp = alert.CreatedAt,
                Data = new
                {
                    AlertId = alert.Id,
                    Category = alert.Category,
                    IsActive = alert.IsActive
                }
            });

            // Send to moderators if it's a critical alert
            if (alert.Severity == "Critical")
            {
                await _notificationHub.Clients.Group("moderator").SendAsync("ReceiveHealthAlert", new
                {
                    Id = alert.Id,
                    Type = "CriticalAlert",
                    Title = $"🚨 Critical Alert: {alert.Title}",
                    Message = alert.Message,
                    Severity = alert.Severity,
                    Category = alert.Category,
                    Timestamp = alert.CreatedAt,
                    Data = new
                    {
                        AlertId = alert.Id,
                        Category = alert.Category,
                        RequiresImmediateAttention = true
                    }
                });
            }

            _logger.LogInformation("health alert sent successfully: {AlertId}", alert.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending health alert: {AlertId}", alert.Id);
        }
    }

    public async Task SendPerformanceAlertAsync(string metricName, double value, double threshold, string severity)
    {
        try
        {
            var alertTitle = $"Performance Alert: {metricName}";
            var alertMessage = $"Metric '{metricName}' value ({value:F2}) has exceeded threshold ({threshold:F2})";

            _logger.LogWarning("Performance Alert: {MetricName} = {Value} (Threshold: {Threshold}, Severity: {Severity})", 
                metricName, value, threshold, severity);

            var notification = new
            {
                Id = Guid.NewGuid(),
                Type = "PerformanceAlert",
                Title = alertTitle,
                Message = alertMessage,
                Severity = severity,
                Category = "Performance",
                Timestamp = DateTime.UtcNow,
                Data = new
                {
                    MetricName = metricName,
                    CurrentValue = value,
                    Threshold = threshold,
                    ExceededBy = value - threshold,
                    ExceededByPercent = ((value - threshold) / threshold * 100)
                }
            };

            // Send to appropriate groups based on severity
            if (severity == "Critical")
            {
                await _notificationHub.Clients.Groups(new[] { "admin", "moderator" })
                    .SendAsync("ReceivePerformanceAlert", notification);
            }
            else
            {
                await _notificationHub.Clients.Group("admin")
                    .SendAsync("ReceivePerformanceAlert", notification);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending QA performance alert for metric: {MetricName}", metricName);
        }
    }

    public async Task SendExpertAvailabilityAlertAsync(string category, int availableExperts, int minimumRequired)
    {
        try
        {
            var severity = availableExperts == 0 ? "Critical" : availableExperts < (minimumRequired / 2) ? "Critical" : "Warning";
            var alertTitle = $"Low Expert Availability: {category}";
            var alertMessage = $"Category '{category}' has only {availableExperts} available experts (minimum required: {minimumRequired})";

            _logger.LogWarning("Expert Availability Alert: {Category} has {Available} experts (minimum: {Required})", 
                category, availableExperts, minimumRequired);

            var notification = new
            {
                Id = Guid.NewGuid(),
                Type = "ExpertAvailabilityAlert",
                Title = alertTitle,
                Message = alertMessage,
                Severity = severity,
                Category = "Experts",
                Timestamp = DateTime.UtcNow,
                Data = new
                {
                    CategoryName = category,
                    AvailableExperts = availableExperts,
                    MinimumRequired = minimumRequired,
                    Deficit = minimumRequired - availableExperts,
                    RecruitmentNeeded = availableExperts < minimumRequired
                }
            };

            // Send to admin and moderator groups
            await _notificationHub.Clients.Groups(new[] { "admin", "moderator" })
                .SendAsync("ReceiveExpertAlert", notification);

            // Also send to experts group for awareness
            await _notificationHub.Clients.Group("experts")
                .SendAsync("ReceiveExpertAvailabilityUpdate", new
                {
                    Category = category,
                    Message = $"More experts needed in {category} category",
                    AvailableExperts = availableExperts,
                    Timestamp = DateTime.UtcNow
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending QA expert availability alert for category: {Category}", category);
        }
    }

    public async Task SendSystemStatusChangeAsync(string oldStatus, string newStatus, string reason)
    {
        try
        {
            var isImprovement = IsStatusImprovement(oldStatus, newStatus);
            var severity = newStatus == "Critical" ? "Critical" : newStatus == "Warning" ? "Warning" : "Info";
            
            var alertTitle = $"System Status Changed: {oldStatus} → {newStatus}";
            var alertMessage = $"System status changed from {oldStatus} to {newStatus}. Reason: {reason}";

            _logger.LogInformation("System Status Change: {OldStatus} → {NewStatus} (Reason: {Reason})", 
                oldStatus, newStatus, reason);

            var notification = new
            {
                Id = Guid.NewGuid(),
                Type = "SystemStatusChange",
                Title = alertTitle,
                Message = alertMessage,
                Severity = severity,
                Category = "System",
                Timestamp = DateTime.UtcNow,
                Data = new
                {
                    OldStatus = oldStatus,
                    NewStatus = newStatus,
                    Reason = reason,
                    IsImprovement = isImprovement,
                    StatusHistory = new[] { oldStatus, newStatus }
                }
            };

            // Send to all admin users
            await _notificationHub.Clients.Group("admin")
                .SendAsync("ReceiveSystemStatusChange", notification);

            // Send to moderators if it's a degradation
            if (!isImprovement && (newStatus == "Warning" || newStatus == "Critical"))
            {
                await _notificationHub.Clients.Group("moderator")
                    .SendAsync("ReceiveSystemStatusChange", notification);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending QA system status change notification");
        }
    }

    public async Task NotifyAdministratorsAsync(string title, string message, string severity = "Info")
    {
        try
        {
            _logger.LogInformation("Sending administrator notification: {Title} (Severity: {Severity})", 
                title, severity);

            var notification = new
            {
                Id = Guid.NewGuid(),
                Type = "AdminNotification",
                Title = title,
                Message = message,
                Severity = severity,
                Category = "Administrative",
                Timestamp = DateTime.UtcNow,
                Data = new
                {
                    Source = "Community System",
                    RequiresAction = severity == "Critical" || severity == "Warning"
                }
            };

            await _notificationHub.Clients.Group("admin")
                .SendAsync("ReceiveAdminNotification", notification);

            // Also send to moderators if critical
            if (severity == "Critical")
            {
                await _notificationHub.Clients.Group("moderator")
                    .SendAsync("ReceiveAdminNotification", notification);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending QA administrator notification");
        }
    }

    #region Private Helper Methods

    private bool IsStatusImprovement(string oldStatus, string newStatus)
    {
        var statusOrder = new Dictionary<string, int>
        {
            { "Critical", 0 },
            { "Warning", 1 },
            { "Healthy", 2 }
        };

        if (!statusOrder.ContainsKey(oldStatus) || !statusOrder.ContainsKey(newStatus))
            return false;

        return statusOrder[newStatus] > statusOrder[oldStatus];
    }

    #endregion
}
public class HealthMonitorBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<HealthMonitorBackgroundService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5); // Check every 5 minutes

    public HealthMonitorBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<HealthMonitorBackgroundService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Health Monitor Background Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var healthService = scope.ServiceProvider.GetRequiredService<IHealthMonitoringService>();
                var alertService = scope.ServiceProvider.GetRequiredService<IAlertService>();

                // Get current health status
                var health = await healthService.GetSystemHealthAsync();
                var alerts = await healthService.GetSystemAlertsAsync();

                // Process new critical alerts
                var criticalAlerts = alerts.Where(a => a.IsActive && a.Severity == "Critical").ToList();
                foreach (var alert in criticalAlerts)
                {
                    await alertService.SendHealthAlertAsync(alert);
                }

                // Check for performance thresholds
                await CheckPerformanceThresholds(healthService, alertService);

                _logger.LogDebug("Health Monitor check completed. Status: {Status}, Alerts: {AlertCount}", 
                    health.Status, alerts.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in QA Health Monitor background service");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }

        _logger.LogInformation("Health Monitor Background Service stopped");
    }

    private async Task CheckPerformanceThresholds(IHealthMonitoringService healthService, IAlertService alertService)
    {
        try
        {
            var health = await healthService.GetSystemHealthAsync();
            
            if (health.Metrics != null)
            {
                // Check response rate threshold
                if (health.Metrics.ResponseRate < 50) // Critical threshold
                {
                    await alertService.SendPerformanceAlertAsync(
                        "Response Rate", 
                        health.Metrics.ResponseRate, 
                        50, 
                        "Critical");
                }
                else if (health.Metrics.ResponseRate < 70) // Warning threshold
                {
                    await alertService.SendPerformanceAlertAsync(
                        "Response Rate", 
                        health.Metrics.ResponseRate, 
                        70, 
                        "Warning");
                }

                // Check response time threshold
                if (health.Metrics.AverageResponseTimeHours > 72) // Critical threshold
                {
                    await alertService.SendPerformanceAlertAsync(
                        "Average Response Time", 
                        health.Metrics.AverageResponseTimeHours, 
                        72, 
                        "Critical");
                }
                else if (health.Metrics.AverageResponseTimeHours > 48) // Warning threshold
                {
                    await alertService.SendPerformanceAlertAsync(
                        "Average Response Time", 
                        health.Metrics.AverageResponseTimeHours, 
                        48, 
                        "Warning");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking performance thresholds");
        }
    }
}