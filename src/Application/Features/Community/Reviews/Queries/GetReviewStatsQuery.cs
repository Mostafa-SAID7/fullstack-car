using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using MediatR;

namespace Application.Features.Community.Reviews.Queries;

public class GetReviewStatsQuery : IRequest<Result<ReviewStatsDto>>
{
}

public class GetReviewStatsQueryHandler : IRequestHandler<GetReviewStatsQuery, Result<ReviewStatsDto>>
{
    public async Task<Result<ReviewStatsDto>> Handle(GetReviewStatsQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement review statistics logic
        await Task.CompletedTask;
        
        var stats = new ReviewStatsDto
        {
            TotalReviews = 0,
            AverageRating = 0,
            TotalUsers = 0,
            ReviewsThisMonth = 0
        };
        
        return Result<ReviewStatsDto>.Success(stats);
    }
}