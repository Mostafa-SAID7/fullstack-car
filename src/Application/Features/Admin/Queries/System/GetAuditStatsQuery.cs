using Application.Common.Models;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetAuditStatsQuery : IRequest<Result<AuditStatsDto>>
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }

    public class AuditStatsDto
    {
        public int TotalEvents { get; set; }
        public int UniqueUsers { get; set; }
        public int SecurityEvents { get; set; }
        public int FailedLogins { get; set; }
        public Dictionary<string, int> EventsByType { get; set; } = new();
        public Dictionary<string, int> EventsByDay { get; set; } = new();
        public List<TopUserActivityDto> TopActiveUsers { get; set; } = new();
        public List<SuspiciousActivityDto> SuspiciousActivities { get; set; } = new();
    }

    public class TopUserActivityDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int ActivityCount { get; set; }
        public DateTime LastActivity { get; set; }
    }

    public class SuspiciousActivityDto
    {
        public Guid Id { get; set; }
        public string ActivityType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public Guid? UserId { get; set; }
        public string? UserName { get; set; }
        public string IpAddress { get; set; } = string.Empty;
    }
}