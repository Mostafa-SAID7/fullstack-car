using Application.Common.Models;
using Application.Features.Admin.DTOs.Dashboard;
using MediatR;

namespace Application.Features.Admin.Queries.Dashboard
{
    public class GetDashboardStatsQuery : IRequest<Result<DashboardStatsDto>>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetSystemInfoQuery : IRequest<Result<SystemInfoDto>>
    {
    }

    public class GetRecentActivityQuery : IRequest<Result<List<ActivityDto>>>
    {
        public int Limit { get; set; } = 10;
        public string? ActivityType { get; set; }
        public DateTime? FromDate { get; set; }
    }

    public class GetSystemAlertsQuery : IRequest<Result<Dictionary<string, List<SystemAlertDto>>>>
    {
        public string? Severity { get; set; }
        public bool IncludeAcknowledged { get; set; } = false;
    }

    public class GetPerformanceMetricsQuery : IRequest<Result<PerformanceMetricsDto>>
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string Granularity { get; set; } = "hour"; // "minute", "hour", "day"
    }
}