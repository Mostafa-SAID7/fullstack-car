using Application.Features.Admin.Analytics.Models;

namespace Application.Features.Admin.Analytics.Services
{
    public class SecurityAnalyticsService : ISecurityAnalyticsService
    {
        private readonly IApplicationDbContext _context;
        private readonly ILogger<SecurityAnalyticsService> _logger;

        public SecurityAnalyticsService(IApplicationDbContext context, ILogger<SecurityAnalyticsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<SecurityAnalytics> GetSecurityAnalyticsAsync(DateTime? startDate, DateTime? endDate, CancellationToken cancellationToken = default)
        {
            var (start, end) = GetDateRange(startDate, endDate);

            try
            {
                var failedLoginAttempts = await _context.SecurityLogs
                    .CountAsync(s => s.EventType == "FailedLogin" && s.Timestamp >= start && s.Timestamp <= end, cancellationToken);

                var suspiciousActivities = await _context.SecurityLogs
                    .CountAsync(s => s.EventType == "SuspiciousActivity" && s.Timestamp >= start && s.Timestamp <= end, cancellationToken);

                var securityIncidents = await _context.SecurityLogs
                    .CountAsync(s => s.EventType == "SecurityIncident" && s.Timestamp >= start && s.Timestamp <= end, cancellationToken);

                var recentThreats = await GetRecentSecurityThreatsAsync(10, cancellationToken);
                var securityEvents = await GetRecentSecurityEventsAsync(20, cancellationToken);

                return new SecurityAnalytics
                {
                    FailedLoginAttempts = failedLoginAttempts,
                    SuspiciousActivities = suspiciousActivities,
                    BlockedIPs = 0, // Implement when IP blocking is added
                    SecurityIncidents = securityIncidents,
                    RecentThreats = recentThreats,
                    SecurityEvents = securityEvents
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting security analytics");
                throw;
            }
        }
        public async Task<List<SecurityTrendData>> GetSecurityTrendsAsync(DateTime startDate, DateTime endDate, string granularity = "day", CancellationToken cancellationToken = default)
        {
            var trends = new List<SecurityTrendData>();
            var currentDate = startDate.Date;
            var increment = granularity.ToLower() == "hour" ? TimeSpan.FromHours(1) : TimeSpan.FromDays(1);

            while (currentDate <= endDate.Date)
            {
                var nextDate = currentDate.Add(increment);
                
                var failedLogins = await _context.SecurityLogs
                    .CountAsync(s => s.EventType == "FailedLogin" && s.Timestamp >= currentDate && s.Timestamp < nextDate, cancellationToken);

                var suspiciousActivities = await _context.SecurityLogs
                    .CountAsync(s => s.EventType == "SuspiciousActivity" && s.Timestamp >= currentDate && s.Timestamp < nextDate, cancellationToken);

                trends.Add(new SecurityTrendData
                {
                    Date = currentDate,
                    FailedLogins = failedLogins,
                    SuspiciousActivities = suspiciousActivities,
                    BlockedIPs = 0, // Implement when IP blocking is added
                    SecurityIncidents = await _context.SecurityLogs
                        .CountAsync(s => s.EventType == "SecurityIncident" && s.Timestamp >= currentDate && s.Timestamp < nextDate, cancellationToken)
                });

                currentDate = nextDate;
            }

            return trends;
        }

        public async Task<List<SecurityThreat>> GetRecentSecurityThreatsAsync(int limit, CancellationToken cancellationToken = default)
        {
            return await _context.SecurityLogs
                .Where(s => s.EventType == "SecurityThreat")
                .OrderByDescending(s => s.Timestamp)
                .Take(limit)
                .Select(s => new SecurityThreat
                {
                    Id = s.Id.ToString(),
                    Type = s.EventType,
                    Source = s.IpAddress ?? "Unknown",
                    Description = s.Description ?? "Security threat detected",
                    Severity = "Medium",
                    DetectedAt = s.Timestamp,
                    Status = "Investigating"
                })
                .ToListAsync(cancellationToken);
        }

        public async Task<List<SecurityEvent>> GetRecentSecurityEventsAsync(int limit, CancellationToken cancellationToken = default)
        {
            return await _context.SecurityLogs
                .OrderByDescending(s => s.Timestamp)
                .Take(limit)
                .Select(s => new SecurityEvent
                {
                    Id = s.Id.ToString(),
                    EventType = s.EventType,
                    UserId = s.UserId.ToString(),
                    IpAddress = s.IpAddress ?? "",
                    UserAgent = s.UserAgent ?? "",
                    Timestamp = s.Timestamp,
                    Details = s.Description ?? ""
                })
                .ToListAsync(cancellationToken);
        }

        private static (DateTime startDate, DateTime endDate) GetDateRange(DateTime? startDate, DateTime? endDate)
        {
            if (startDate.HasValue && endDate.HasValue)
                return (startDate.Value, endDate.Value);

            var now = DateTime.UtcNow;
            return (now.AddDays(-7), now);
        }
    }
}