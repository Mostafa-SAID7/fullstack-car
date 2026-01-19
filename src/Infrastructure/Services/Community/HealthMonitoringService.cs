using Application.Features.QA.DTOs;
using Domain.Entities.Community;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Infrastructure.Common;
using System.Diagnostics;

namespace Infrastructure.Services.Community;
public interface IHealthMonitoringService
{
    Task<SystemHealthDto> GetSystemHealthAsync();
    Task<PerformanceMetricsDto> GetPerformanceMetricsAsync();
    Task<List<SystemAlertDto>> GetSystemAlertsAsync();
    Task<UserSatisfactionDto> GetUserSatisfactionMetricsAsync();
    Task RecordPerformanceMetricAsync(string metricName, double value, string category = "General");
    Task TriggerHealthCheckAsync();
}

public class HealthMonitoringService : IHealthMonitoringService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<HealthMonitoringService> _logger;
    private readonly AnalyticsSettings _analyticsSettings;
    private readonly IConnectionManager _connectionManager;

    public HealthMonitoringService(
        ApplicationDbContext context,
        ILogger<HealthMonitoringService> logger,
        IOptions<AnalyticsSettings> analyticsSettings,
        IConnectionManager connectionManager)
    {
        _context = context;
        _logger = logger;
        _analyticsSettings = analyticsSettings.Value;
        _connectionManager = connectionManager;
    }

    public async Task<SystemHealthDto> GetSystemHealthAsync()
    {
        try
        {
            var stopwatch = Stopwatch.StartNew();

            // Get basic system metrics
            var totalQuestions = await _context.Questions.CountAsync(q => !q.IsDeleted);
            var totalAnswers = await _context.Answers.CountAsync(a => !a.IsDeleted);
            var activeUsers = await _context.UserReputations.CountAsync(ur => ur.ReputationScore > 0);
            
            // Get recent activity (last 24 hours)
            var yesterday = DateTime.UtcNow.AddDays(-1);
            var recentQuestions = await _context.Questions.CountAsync(q => q.CreatedAt >= yesterday && !q.IsDeleted);
            var recentAnswers = await _context.Answers.CountAsync(a => a.CreatedAt >= yesterday && !a.IsDeleted);
            var recentVotes = await _context.Votes.CountAsync(v => v.CreatedAt >= yesterday);

            // Calculate response rate (questions with at least one answer)
            var questionsWithAnswers = await _context.Questions
                .Where(q => !q.IsDeleted && q.AnswersCount > 0)
                .CountAsync();
            var responseRate = totalQuestions > 0 ? (double)questionsWithAnswers / totalQuestions * 100 : 0;

            // Calculate average response time (in hours)
            var avgResponseTime = await CalculateAverageResponseTimeAsync();

            // Get SignalR connection health
            var connectionHealth = await _connectionManager.GetConnectionHealthAsync();

            // Determine overall health status
            var healthStatus = DetermineHealthStatus(responseRate, avgResponseTime, connectionHealth.ActiveConnections);

            stopwatch.Stop();

            var healthDto = new SystemHealthDto
            {
                Status = healthStatus,
                Timestamp = DateTime.UtcNow,
                CheckDurationMs = stopwatch.ElapsedMilliseconds,
                Metrics = new HealthMetricsDto
                {
                    TotalQuestions = totalQuestions,
                    TotalAnswers = totalAnswers,
                    ActiveUsers = activeUsers,
                    RecentQuestions24h = recentQuestions,
                    RecentAnswers24h = recentAnswers,
                    RecentVotes24h = recentVotes,
                    ResponseRate = responseRate,
                    AverageResponseTimeHours = avgResponseTime,
                    ActiveConnections = connectionHealth.ActiveConnections,
                    ConnectionHealth = connectionHealth.Status
                },
                Dependencies = new DependencyHealthDto
                {
                    Database = await CheckDatabaseHealthAsync(),
                    SignalR = connectionHealth.Status,
                    SearchIndex = "Healthy", // Placeholder - would integrate with actual search service
                    Cache = "Healthy" // Placeholder - would integrate with actual cache service
                }
            };

            _logger.LogInformation("Community System health check completed in {Duration}ms. Status: {Status}", 
                stopwatch.ElapsedMilliseconds, healthStatus);

            return healthDto;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing system health check");
            return new SystemHealthDto
            {
                Status = "Critical",
                Timestamp = DateTime.UtcNow,
                CheckDurationMs = 0,
                Error = "Health check failed: " + ex.Message
            };
        }
    }

    public async Task<PerformanceMetricsDto> GetPerformanceMetricsAsync()
    {
        try
        {
            var last24Hours = DateTime.UtcNow.AddDays(-1);
            var last7Days = DateTime.UtcNow.AddDays(-7);

            // Question performance metrics
            var questionMetrics = await _context.Questions
                .Where(q => q.CreatedAt >= last7Days && !q.IsDeleted)
                .GroupBy(q => q.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .OrderBy(x => x.Date)
                .ToListAsync();

            // Answer performance metrics
            var answerMetrics = await _context.Answers
                .Where(a => a.CreatedAt >= last7Days && !a.IsDeleted)
                .GroupBy(a => a.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .OrderBy(x => x.Date)
                .ToListAsync();

            // Vote performance metrics
            var voteMetrics = await _context.Votes
                .Where(v => v.CreatedAt >= last7Days)
                .GroupBy(v => v.CreatedAt.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .OrderBy(x => x.Date)
                .ToListAsync();

            // Expert response metrics
            var expertResponseRate = await CalculateExpertResponseRateAsync();

            // Search performance (placeholder - would integrate with actual search metrics)
            var searchPerformance = new SearchPerformanceDto
            {
                AverageSearchTimeMs = 150, // Placeholder
                SearchesPerHour = 45, // Placeholder
                SearchSuccessRate = 95.5 // Placeholder
            };

            return new PerformanceMetricsDto
            {
                Timestamp = DateTime.UtcNow,
                QuestionTrends = questionMetrics.Select(m => new MetricDataPointDto 
                { 
                    Date = m.Date, 
                    Value = m.Count 
                }).ToList(),
                AnswerTrends = answerMetrics.Select(m => new MetricDataPointDto 
                { 
                    Date = m.Date, 
                    Value = m.Count 
                }).ToList(),
                VoteTrends = voteMetrics.Select(m => new MetricDataPointDto 
                { 
                    Date = m.Date, 
                    Value = m.Count 
                }).ToList(),
                ExpertResponseRate = expertResponseRate,
                SearchPerformance = searchPerformance,
                SystemLoad = await GetSystemLoadMetricsAsync()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting performance metrics");
            throw;
        }
    }

    public async Task<List<SystemAlertDto>> GetSystemAlertsAsync()
    {
        var alerts = new List<SystemAlertDto>();

        try
        {
            // Check for low response rate
            var responseRate = await CalculateResponseRateAsync();
            if (responseRate < 70) // Threshold for concern
            {
                alerts.Add(new SystemAlertDto
                {
                    Id = Guid.NewGuid(),
                    Type = "Warning",
                    Title = "Low Question Response Rate",
                    Message = $"Current response rate is {responseRate:F1}%, below the 70% threshold",
                    Severity = responseRate < 50 ? "Critical" : "Warning",
                    Category = "Performance",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                });
            }

            // Check for slow response times
            var avgResponseTime = await CalculateAverageResponseTimeAsync();
            if (avgResponseTime > 48) // More than 48 hours
            {
                alerts.Add(new SystemAlertDto
                {
                    Id = Guid.NewGuid(),
                    Type = "Warning",
                    Title = "Slow Question Response Time",
                    Message = $"Average response time is {avgResponseTime:F1} hours, above the 48-hour threshold",
                    Severity = avgResponseTime > 72 ? "Critical" : "Warning",
                    Category = "Performance",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                });
            }

            // Check for expert availability
            var activeExperts = await _context.Experts
                .CountAsync(e => e.NotificationEnabled && e.ResponseRate > 50);
            if (activeExperts < 5) // Minimum expert threshold
            {
                alerts.Add(new SystemAlertDto
                {
                    Id = Guid.NewGuid(),
                    Type = "Warning",
                    Title = "Low Expert Availability",
                    Message = $"Only {activeExperts} active experts available, below minimum threshold of 5",
                    Severity = activeExperts < 3 ? "Critical" : "Warning",
                    Category = "Experts",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                });
            }

            // Check SignalR connection health
            var connectionHealth = await _connectionManager.GetConnectionHealthAsync();
            if (connectionHealth.Status != "Healthy")
            {
                alerts.Add(new SystemAlertDto
                {
                    Id = Guid.NewGuid(),
                    Type = "Error",
                    Title = "SignalR Connection Issues",
                    Message = $"SignalR connection status: {connectionHealth.Status}",
                    Severity = "Critical",
                    Category = "Infrastructure",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                });
            }

            return alerts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting system alerts");
            alerts.Add(new SystemAlertDto
            {
                Id = Guid.NewGuid(),
                Type = "Error",
                Title = "Health Monitoring Error",
                Message = "Failed to retrieve system alerts: " + ex.Message,
                Severity = "Critical",
                Category = "System",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            });
            return alerts;
        }
    }

    public async Task<UserSatisfactionDto> GetUserSatisfactionMetricsAsync()
    {
        try
        {
            var last30Days = DateTime.UtcNow.AddDays(-30);

            // Calculate satisfaction based on answer acceptance rates
            var totalAnswers = await _context.Answers
                .CountAsync(a => a.CreatedAt >= last30Days && !a.IsDeleted);
            var acceptedAnswers = await _context.Answers
                .CountAsync(a => a.CreatedAt >= last30Days && a.IsAccepted && !a.IsDeleted);

            var acceptanceRate = totalAnswers > 0 ? (double)acceptedAnswers / totalAnswers * 100 : 0;

            // Calculate user engagement metrics
            var activeUsers = await _context.UserActivities
                .Where(ua => ua.CreatedAt >= last30Days)
                .Select(ua => ua.UserId)
                .Distinct()
                .CountAsync();

            var totalUsers = await _context.UserReputations.CountAsync();
            var engagementRate = totalUsers > 0 ? (double)activeUsers / totalUsers * 100 : 0;

            // Calculate average vote scores as satisfaction indicator
            var avgQuestionScore = await _context.Questions
                .Where(q => q.CreatedAt >= last30Days && !q.IsDeleted)
                .AverageAsync(q => (double?)(q.UpvotesCount - q.DownvotesCount)) ?? 0;

            var avgAnswerScore = await _context.Answers
                .Where(a => a.CreatedAt >= last30Days && !a.IsDeleted)
                .AverageAsync(a => (double?)(a.UpvotesCount - a.DownvotesCount)) ?? 0;

            // Calculate overall satisfaction score (weighted average)
            var overallSatisfaction = (acceptanceRate * 0.4 + engagementRate * 0.3 + 
                                     Math.Max(0, (avgQuestionScore + 5) * 10) * 0.15 + 
                                     Math.Max(0, (avgAnswerScore + 5) * 10) * 0.15);

            return new UserSatisfactionDto
            {
                Timestamp = DateTime.UtcNow,
                OverallSatisfactionScore = Math.Min(100, Math.Max(0, overallSatisfaction)),
                AnswerAcceptanceRate = acceptanceRate,
                UserEngagementRate = engagementRate,
                AverageQuestionScore = avgQuestionScore,
                AverageAnswerScore = avgAnswerScore,
                ActiveUsers30Days = activeUsers,
                TotalUsers = totalUsers,
                SatisfactionTrend = await GetSatisfactionTrendAsync()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating user satisfaction metrics");
            throw;
        }
    }

    public async Task RecordPerformanceMetricAsync(string metricName, double value, string category = "General")
    {
        try
        {
            // Record performance metric for monitoring
            _logger.LogInformation("QA Performance Metric: {MetricName} = {Value} (Category: {Category})", 
                metricName, value, category);

            // In a real implementation, this would store to a metrics database or send to monitoring service
            // For now, we'll just log it following existing patterns
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recording performance metric {MetricName}", metricName);
        }
    }

    public async Task TriggerHealthCheckAsync()
    {
        try
        {
            _logger.LogInformation("Triggering system health check");
            
            var health = await GetSystemHealthAsync();
            var alerts = await GetSystemAlertsAsync();
            
            // If there are critical alerts, log them
            var criticalAlerts = alerts.Where(a => a.Severity == "Critical").ToList();
            if (criticalAlerts.Any())
            {
                _logger.LogWarning("System has {Count} critical alerts", criticalAlerts.Count);
                foreach (var alert in criticalAlerts)
                {
                    _logger.LogWarning("Critical Alert: {Title} - {Message}", alert.Title, alert.Message);
                }
            }

            _logger.LogInformation("System health check completed. Status: {Status}", health.Status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during health check trigger");
        }
    }

    #region Private Helper Methods

    private async Task<double> CalculateAverageResponseTimeAsync()
    {
        try
        {
            var questionsWithAnswers = await _context.Questions
                .Where(q => !q.IsDeleted && q.AnswersCount > 0)
                .Select(q => new { q.Id, q.CreatedAt })
                .ToListAsync();

            if (!questionsWithAnswers.Any())
                return 0;

            var responseTimes = new List<double>();

            foreach (var question in questionsWithAnswers)
            {
                var firstAnswer = await _context.Answers
                    .Where(a => a.QuestionId == question.Id && !a.IsDeleted)
                    .OrderBy(a => a.CreatedAt)
                    .FirstOrDefaultAsync();

                if (firstAnswer != null)
                {
                    var responseTime = (firstAnswer.CreatedAt - question.CreatedAt).TotalHours;
                    responseTimes.Add(responseTime);
                }
            }

            return responseTimes.Any() ? responseTimes.Average() : 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating average response time");
            return 0;
        }
    }

    private async Task<double> CalculateResponseRateAsync()
    {
        try
        {
            var totalQuestions = await _context.Questions.CountAsync(q => !q.IsDeleted);
            var questionsWithAnswers = await _context.Questions
                .CountAsync(q => !q.IsDeleted && q.AnswersCount > 0);

            return totalQuestions > 0 ? (double)questionsWithAnswers / totalQuestions * 100 : 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating response rate");
            return 0;
        }
    }

    private async Task<double> CalculateExpertResponseRateAsync()
    {
        try
        {
            var experts = await _context.Experts
                .Where(e => e.NotificationEnabled)
                .ToListAsync();

            if (!experts.Any())
                return 0;

            return experts.Average(e => (double)e.ResponseRate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating expert response rate");
            return 0;
        }
    }

    private string DetermineHealthStatus(double responseRate, double avgResponseTime, int activeConnections)
    {
        if (responseRate < 50 || avgResponseTime > 72 || activeConnections == 0)
            return "Critical";
        
        if (responseRate < 70 || avgResponseTime > 48)
            return "Warning";
        
        return "Healthy";
    }

    private async Task<string> CheckDatabaseHealthAsync()
    {
        try
        {
            // Check if using in-memory database (for testing)
            if (_context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
            {
                // For in-memory database, just check if context can be accessed
                var canConnect = await _context.Database.CanConnectAsync();
                return canConnect ? "Healthy" : "Unhealthy";
            }
            
            // For relational databases, use SQL query
            await _context.Database.ExecuteSqlRawAsync("SELECT 1");
            return "Healthy";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database health check failed");
            return "Unhealthy";
        }
    }

    private async Task<SystemLoadDto> GetSystemLoadMetricsAsync()
    {
        try
        {
            // Get current system load metrics
            var process = Process.GetCurrentProcess();
            
            return new SystemLoadDto
            {
                CpuUsagePercent = 0, // Placeholder - would need performance counters
                MemoryUsageMB = process.WorkingSet64 / (1024 * 1024),
                ActiveThreads = process.Threads.Count,
                DatabaseConnections = _context.Database.GetDbConnection().State.ToString(),
                QueuedTasks = 0 // Placeholder - would integrate with task queue
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting system load metrics");
            return new SystemLoadDto();
        }
    }

    private async Task<List<MetricDataPointDto>> GetSatisfactionTrendAsync()
    {
        try
        {
            var last7Days = DateTime.UtcNow.AddDays(-7);
            var trends = new List<MetricDataPointDto>();

            for (int i = 6; i >= 0; i--)
            {
                var date = DateTime.UtcNow.AddDays(-i).Date;
                var nextDate = date.AddDays(1);

                var dayAnswers = await _context.Answers
                    .CountAsync(a => a.CreatedAt >= date && a.CreatedAt < nextDate && !a.IsDeleted);
                var dayAccepted = await _context.Answers
                    .CountAsync(a => a.CreatedAt >= date && a.CreatedAt < nextDate && a.IsAccepted && !a.IsDeleted);

                var dayAcceptanceRate = dayAnswers > 0 ? (double)dayAccepted / dayAnswers * 100 : 0;

                trends.Add(new MetricDataPointDto
                {
                    Date = date,
                    Value = dayAcceptanceRate
                });
            }

            return trends;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting satisfaction trend");
            return new List<MetricDataPointDto>();
        }
    }

    #endregion
}
