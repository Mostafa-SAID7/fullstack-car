using Application.Common.DTOs;
using Application.Common.Interfaces;
using Application.Features.Community.Reviews.DTOs;
using MediatR;

namespace Application.Features.Community.Reviews.Queries;

public class GetUserReviewsQuery : IRequest<ApiResponseDto<PagedResult<ReviewDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetUserReviewsQueryHandler : IRequestHandler<GetUserReviewsQuery, ApiResponseDto<PagedResult<ReviewDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetUserReviewsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponseDto<PagedResult<ReviewDto>>> Handle(GetUserReviewsQuery request, CancellationToken cancellationToken)
    {
        // Delegate to GetReviewsQuery with UserId filter (would need to add UserId to GetReviewsQuery)
        var query = new GetReviewsQuery
        {
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            SortBy = "CreatedAt",
            SortDescending = true
        };

        var handler = new GetReviewsQueryHandler(_context);
        var result = await handler.Handle(query, cancellationToken);

        // Filter by UserId in memory for now (TODO: add UserId filter to GetReviewsQuery)
        if (result.Succeeded && result.Data?.Items != null)
        {
            var filteredItems = result.Data.Items.Where(r => r.UserId == request.UserId).ToList();
            result.Data.Items = filteredItems;
            result.Data.TotalCount = filteredItems.Count;
        }

        return result;
    }
}
