using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Maps.Queries;

public class GetMapsQuery : IRequest<ApiResponseDto<object>>
{
    public string? SearchTerm { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetMapsQueryHandler : IRequestHandler<GetMapsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetMapsQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Maps = new object[0], TotalCount = 0 });
    }
}
