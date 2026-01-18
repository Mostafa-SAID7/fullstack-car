using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.SiteSettings.Queries;

public class GetSystemMetricsQuery : IRequest<ApiResponseDto<object>>
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? MetricType { get; set; } // "performance", "resources", "database", "all"
}

public class GetSystemMetricsQueryHandler : IRequestHandler<GetSystemMetricsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetSystemMetricsQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var metrics = new
        {
            Period = new { From = request.FromDate ?? DateTime.UtcNow.AddDays(-7), To = request.ToDate ?? DateTime.UtcNow },
            Performance = new
            {
                AverageResponseTime = 125.5,
                RequestsPerSecond = 45.2,
                ErrorRate = 0.02,
                Uptime = 99.95
            },
            Resources = new
            {
                CpuUsage = 35.2,
                MemoryUsage = 68.7,
                DiskUsage = 42.1,
                NetworkIO = 15.3
            },
            Database = new
            {
                ConnectionCount = 25,
                QueryTime = 45.2,
                CacheHitRate = 85.6
            }
        };
        
        return ApiResponseDto<object>.Success(metrics);
    }
}