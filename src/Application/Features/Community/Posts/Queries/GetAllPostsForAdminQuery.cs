using Application.Common.Models;
using Application.Features.Community.Posts.DTOs;
using Domain.Entities.Community.Posts;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Domain.Enums.Community.Posts;
using MediatR;

namespace Application.Features.Community.Posts.Queries
{
    public class GetAllPostsForAdminQuery : IRequest<Result<PaginatedList<PostDto>>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Status { get; set; }
        public Guid? UserId { get; set; }
    }

    public class GetAllPostsForAdminQueryHandler : IRequestHandler<GetAllPostsForAdminQuery, Result<PaginatedList<PostDto>>>
    {
        private readonly IRepository<Post> _postRepository;

        public GetAllPostsForAdminQueryHandler(IRepository<Post> postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PaginatedList<PostDto>>> Handle(GetAllPostsForAdminQuery request, CancellationToken cancellationToken)
        {
            // For admin, we want to see ALL posts regardless of status
            var skip = (request.PageNumber - 1) * request.PageSize;

            // This would need a proper specification implementation
            // For now, we'll use a simple approach
            var posts = await _postRepository.GetAllAsync(cancellationToken);

            // Apply filters
            if (!string.IsNullOrEmpty(request.Status))
            {
                if (Enum.TryParse<PostStatus>(request.Status, true, out var statusEnum))
                {
                    posts = posts.Where(p => p.Status == statusEnum).ToList();
                }
            }

            if (request.UserId.HasValue)
            {
                posts = posts.Where(p => p.UserId == request.UserId.Value).ToList();
            }

            var totalCount = posts.Count();
            var pagedPosts = posts.Skip(skip).Take(request.PageSize).ToList();

            var postDtos = pagedPosts.Select(p => new PostDto
            {
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                Type = p.Type,
                Status = p.Status,
                ViewsCount = p.ViewsCount,
                LikesCount = p.LikesCount,
                CommentsCount = p.CommentsCount,
                UserId = p.UserId,
                GroupId = p.GroupId,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            }).ToList();

            var paginatedList = new PaginatedList<PostDto>(postDtos, totalCount, request.PageNumber, request.PageSize);
            return Result<PaginatedList<PostDto>>.Success(paginatedList);
        }
    }
}