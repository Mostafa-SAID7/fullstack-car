using Application.Common.DTOs;
using Application.Features.Admin.SiteSettings.DTOs;
using MediatR;

namespace Application.Features.Admin.SiteSettings.Commands;

public class RestartServicesCommand : IRequest<ApiResponseDto<object>>
{
    public RestartServicesRequest Request { get; set; } = null!;
    public Guid RequestedBy { get; set; }
}

public class RestartServicesCommandHandler : IRequestHandler<RestartServicesCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(RestartServicesCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var result = new
        {
            Services = request.Request.ServiceNames ?? new[] { "WebAPI", "BackgroundService", "CacheService" },
            Status = "Restarted",
            RestartedAt = DateTime.UtcNow,
            RestartedBy = request.RequestedBy
        };
        
        return ApiResponseDto<object>.Success(result);
    }
}