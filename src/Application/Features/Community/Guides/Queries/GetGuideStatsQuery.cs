using Application.Common.DTOs;
using MediatR;

namespace Application.Features.Community.Guides.Queries;

public class GetGuideStatsQuery : IRequest<ApiResponseDto<object>>
{
}

public class GetGuideStatsQueryHandler : IRequestHandler<GetGuideStatsQuery, ApiResponseDto<object>>
{
    public async Task<ApiResponseDto<object>> Handle(GetGuideStatsQuery request, CancellationToken cancellationToken)
    {
        // Mock implementation
        await Task.Delay(1, cancellationToken);
        return ApiResponseDto<object>.Success(new 
        { 
            TotalGuides = 150,
            PublishedGuides = 120,
            DraftGuides = 30,
            TotalViews = 25000,
            TotalBookmarks = 1200,
            AverageRating = 4.2
        });
    }
}
