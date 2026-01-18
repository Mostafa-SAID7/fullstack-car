using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Guides.Queries;

public class GetFeaturedGuidesQuery : IRequest<ApiResponseDto<object>>
{
    public int PageSize { get; set; } = 5;
}

public class GetFeaturedGuidesQueryHandler : IRequestHandler<GetFeaturedGuidesQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetFeaturedGuidesQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new { Guides = new object[0] });
    }
}