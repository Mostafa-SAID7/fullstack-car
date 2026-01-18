using Application.Common.DTOs;
using Application.Features.Admin.SiteSettings.DTOs;
using MediatR;

namespace Application.Features.Admin.SiteSettings.Commands;

public class UpdateFeatureFlagsCommand : IRequest<ApiResponseDto<object>>
{
    public UpdateFeatureFlagsRequest Request { get; set; } = new();
    public Guid UpdatedBy { get; set; }
}

public class UpdateFeatureFlagsCommandHandler : IRequestHandler<UpdateFeatureFlagsCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(UpdateFeatureFlagsCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var result = new
        {
            Features = request.Request.FeatureFlags,
            UpdatedAt = DateTime.UtcNow,
            UpdatedBy = request.UpdatedBy,
            UpdatedCount = request.Request.FeatureFlags.Count
        };
        
        return ApiResponseDto<object>.Success(result);
    }
}