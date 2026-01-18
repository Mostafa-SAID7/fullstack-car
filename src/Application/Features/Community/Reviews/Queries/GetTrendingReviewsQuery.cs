using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using MediatR;

namespace Application.Features.Community.Reviews.Queries;

public class GetTrendingReviewsQuery : IRequest<Result<List<ReviewDto>>>
{
    public int PageSize { get; set; } = 10;
    public int Days { get; set; } = 7;
}

public class GetTrendingReviewsQueryHandler : IRequestHandler<GetTrendingReviewsQuery, Result<List<ReviewDto>>>
{
    public async Task<Result<List<ReviewDto>>> Handle(GetTrendingReviewsQuery request, CancellationToken cancellationToken)
    {
        // TODO: Implement trending reviews logic
        await Task.CompletedTask;
        
        var reviews = new List<ReviewDto>();
        
        return Result<List<ReviewDto>>.Success(reviews);
    }
}