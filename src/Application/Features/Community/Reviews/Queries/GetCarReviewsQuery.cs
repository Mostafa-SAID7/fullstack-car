using Application.Common.DTOs;
using Application.Common.Interfaces;
using Application.Features.Community.Reviews.DTOs;
using MediatR;

namespace Application.Features.Community.Reviews.Queries;

public class GetCarReviewsQuery : IRequest<ApiResponseDto<PagedResult<ReviewDto>>>
{
    public string CarBrand { get; set; } = string.Empty;
    public string CarModel { get; set; } = string.Empty;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = true;
}

public class GetCarReviewsQueryHandler : IRequestHandler<GetCarReviewsQuery, ApiResponseDto<PagedResult<ReviewDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetCarReviewsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponseDto<PagedResult<ReviewDto>>> Handle(GetCarReviewsQuery request, CancellationToken cancellationToken)
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

        var handler = new GetReviewsQueryHandler(_context);
        return await handler.Handle(query, cancellationToken);
    }
}
