using Application.Common.Models;
using Application.Features.Admin.Dashboard.DTOs.Responses;
using Application.Features.Admin.Dashboard.Models;
using MediatR;

namespace Application.Features.Admin.Dashboard.Queries
{
    public class GetDashboardStatsQuery : IRequest<Result<DashboardStatsResponse>>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public bool IncludeSystemInfo { get; set; } = true;
        public bool IncludePerformanceMetrics { get; set; } = true;
        public bool IncludeRecentActivity { get; set; } = true;
    }

    public class GetSystemInfoQuery : IRequest<Result<SystemInfo>>
    {
    }

    public class GetRecentActivityQuery : IRequest<Result<List<Activity>>>
    {
        public int Limit { get; set; } = 10;
        public string? ActivityType { get; set; }
        public DateTime? FromDate { get; set; }
    }

    public class GetSystemAlertsQuery : IRequest<Result<Dictionary<string, List<SystemAlert>>>>
    {
        public string? Severity { get; set; }
        public bool IncludeAcknowledged { get; set; } = false;
    }

    public class GetPerformanceMetricsQuery : IRequest<Result<PerformanceMetrics>>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string Granularity { get; set; } = "hour"; // "minute", "hour", "day"
    }
}
