using Application.Common.DTOs;
using Application.Features.Admin.SiteSettings.DTOs;
using MediatR;

namespace Application.Features.Admin.SiteSettings.Commands;

public class ClearSystemCacheCommand : IRequest<ApiResponseDto<object>>
{
    public ClearCacheRequest Request { get; set; } = new();
    public Guid ClearedBy { get; set; }
}

public class ClearSystemCacheCommandHandler : IRequestHandler<ClearSystemCacheCommand, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(ClearSystemCacheCommand request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        
        var result = new
        {
            CacheType = request.Request.CacheType ?? "all",
            ItemsCleared = 1250,
            ClearedAt = DateTime.UtcNow,
            ClearedBy = request.ClearedBy
        };
        
        return ApiResponseDto<object>.Success(result);
    }
}