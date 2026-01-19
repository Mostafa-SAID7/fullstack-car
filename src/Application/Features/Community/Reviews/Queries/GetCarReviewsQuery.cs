using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Domain.Entities.Community.Reviews;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Reviews.Queries;

public class GetCarReviewsQuery : IRequest<Result<PaginatedList<ReviewDto>>>
{
    public string CarBrand { get; set; } = string.Empty;
    public string CarModel { get; set; } = string.Empty;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = true;
}

public class GetCarReviewsQueryHandler : IRequestHandler<GetCarReviewsQuery, Result<PaginatedList<ReviewDto>>>
{
    private readonly IRepository<Review> _reviewRepository;

    public GetCarReviewsQueryHandler(IRepository<Review> reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<Result<PaginatedList<ReviewDto>>> Handle(GetCarReviewsQuery request, CancellationToken cancellationToken)
    {
        // Delegate to GetReviewsQuery with car filter
        var query = new GetReviewsQuery
        {
            CarBrand = request.CarBrand,
            CarModel = request.CarModel,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            SortBy = request.SortBy ?? "CreatedAt",
            SortDescending = request.SortDescending
        };

        var handler = new GetReviewsQueryHandler(_reviewRepository);
        return await handler.Handle(query, cancellationToken);
    }
}
