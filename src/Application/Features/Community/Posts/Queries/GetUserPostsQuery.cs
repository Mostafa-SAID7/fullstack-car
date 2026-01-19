using Application.Common.DTOs;
using Application.Common.Interfaces;
using Application.Features.Community.Posts.DTOs;
using Domain.Entities.Community.Posts;
using MediatR;

namespace Application.Features.Community.Posts.Queries;

public class GetUserPostsQuery : IRequest<ApiResponseDto<PagedResult<PostDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetUserPostsQueryHandler : IRequestHandler<GetUserPostsQuery, ApiResponseDto<PagedResult<PostDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetUserPostsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponseDto<PagedResult<PostDto>>> Handle(GetUserPostsQuery request, CancellationToken cancellationToken)
    {
        // Delegate to GetPostsQuery with UserId filter
        var query = new GetPostsQuery
        {
            UserId = request.UserId,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            SortBy = "CreatedAt",
            SortDescending = true
        };

        var handler = new GetPostsQueryHandler(_context);
        return await handler.Handle(query, cancellationToken);
    }
}
