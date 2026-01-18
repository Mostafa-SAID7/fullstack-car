using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Guides.Queries;

public class GetTrendingGuidesQuery : IRequest<ApiResponseDto<object>>
{
    public int PageSize { get; set; } = 10;
    public int Days { get; set; } = 7;
}

public class GetTrendingGuidesQueryHandler : IRequestHandler<GetTrendingGuidesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetTrendingGuidesQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Guides = new object[0] });
    }
}