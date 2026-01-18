using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.SiteSettings.Queries;

public class GetFeatureFlagsQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetFeatureFlagsQueryHandler : IRequestHandler<GetFeatureFlagsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetFeatureFlagsQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var featureFlags = new
        {
            Features = new Dictionary<string, bool>
            {
                { "EnableAdvancedSearch", true },
                { "EnableRealTimeNotifications", true },
                { "EnableBetaFeatures", false },
                { "EnableAnalytics", true },
                { "EnableCaching", true },
                { "EnableMaintenanceMode", false },
                { "EnableUserRegistration", true },
                { "EnableSocialLogin", true }
            },
            LastUpdated = DateTime.UtcNow.AddDays(-2)
        };
        
        return ApiResponseDto<object>.Success(featureFlags);
    }
}