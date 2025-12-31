using Application.Features.Admin.Analytics.DTOs.Responses;
using Application.Features.Admin.Analytics.Queries;

namespace Application.Features.Admin.Analytics.Handlers
{
    public class GetSecurityAnalyticsHandler : IRequestHandler<GetSecurityAnalyticsQuery, Result<SecurityAnalyticsResponse>>
    {
        private readonly ISecurityAnalyticsService _securityAnalyticsService;

        public GetSecurityAnalyticsHandler(ISecurityAnalyticsService securityAnalyticsService)
        {
            _securityAnalyticsService = securityAnalyticsService;
        }

        public async Task<Result<SecurityAnalyticsResponse>> Handle(GetSecurityAnalyticsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var securityAnalytics = await _securityAnalyticsService.GetSecurityAnalyticsAsync(request.StartDate, request.EndDate, cancellationToken);
                var securityTrends = await _securityAnalyticsService.GetSecurityTrendsAsync(
                    request.StartDate ?? DateTime.UtcNow.AddDays(-30), 
                    request.EndDate ?? DateTime.UtcNow, 
                    request.Granularity ?? "day", 
                    cancellationToken);

                var response = new SecurityAnalyticsResponse
                {
                    Data = securityAnalytics,
                    Trends = securityTrends,
                    Metadata = new AnalyticsMetadata
                    {
                        StartDate = request.StartDate,
                        EndDate = request.EndDate,
                        Granularity = request.Granularity ?? "day",
                        Metrics = request.Metrics ?? new List<string>(),
                        TotalRecords = securityAnalytics.FailedLoginAttempts + securityAnalytics.SuspiciousActivities,
                        DataSource = "SecurityAnalytics"
                    },
                    Summary = new Dictionary<string, object>
                    {
                        { "security_status", securityAnalytics.SecurityIncidents == 0 ? "secure" : "alert" },
                        { "threat_level", securityAnalytics.SecurityIncidents > 5 ? "high" : securityAnalytics.SecurityIncidents > 0 ? "medium" : "low" },
                        { "failed_login_trend", securityAnalytics.FailedLoginAttempts > 50 ? "increasing" : "normal" }
                    }
                };

                return Result<SecurityAnalyticsResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<SecurityAnalyticsResponse>.Failure($"Error retrieving security analytics: {ex.Message}");
            }
        }
    }
}