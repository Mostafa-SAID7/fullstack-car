using Application.Common.Models;
using Application.Features.Community.Posts.DTOs;
using Domain.Entities.Community.Posts;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Posts.Queries;

public class GetUserPostsQuery : IRequest<Result<PaginatedList<PostDto>>>
{
    public Guid UserId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetUserPostsQueryHandler : IRequestHandler<GetUserPostsQuery, Result<PaginatedList<PostDto>>>
{
    private readonly IRepository<Post> _postRepository;

    public GetUserPostsQueryHandler(IRepository<Post> postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<Result<PaginatedList<PostDto>>> Handle(GetUserPostsQuery request, CancellationToken cancellationToken)
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

        var handler = new GetPostsQueryHandler(_postRepository);
        return await handler.Handle(query, cancellationToken);
    }
}
