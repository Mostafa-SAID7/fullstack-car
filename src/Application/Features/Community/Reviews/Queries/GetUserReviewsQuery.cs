using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Domain.Entities.Community.Reviews;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Reviews.Queries;

public class GetUserReviewsQuery : IRequest<Result<PaginatedList<ReviewDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetUserReviewsQueryHandler : IRequestHandler<GetUserReviewsQuery, Result<PaginatedList<ReviewDto>>>
{
    private readonly IRepository<Review> _reviewRepository;

    public GetUserReviewsQueryHandler(IRepository<Review> reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<Result<PaginatedList<ReviewDto>>> Handle(GetUserReviewsQuery request, CancellationToken cancellationToken)
    {
        // Delegate to GetReviewsQuery with UserId filter
        var query = new GetReviewsQuery
        {
            UserId = request.UserId,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            SortBy = "CreatedAt",
            SortDescending = true
        };

        var handler = new GetReviewsQueryHandler(_reviewRepository);
        return await handler.Handle(query, cancellationToken);
    }
}
