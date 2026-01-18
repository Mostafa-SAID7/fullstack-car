using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Admin.SystemConfiguration.Queries;

public class GetSystemConfigurationQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetSystemConfigurationQueryHandler : IRequestHandler<GetSystemConfigurationQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetSystemConfigurationQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { DatabaseConnected = true, CacheEnabled = true });
    }
}