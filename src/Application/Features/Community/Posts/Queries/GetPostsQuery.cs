using Application.Common.Models;
using Application.Features.Community.Posts.DTOs;
using Domain.Entities.Community.Posts;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Domain.Specifications;
using Application.Common.Interfaces.Caching;
using MediatR;

namespace Application.Features.Community.Posts.Queries
{
    public class GetPostsQuery : IRequest<Result<PaginatedList<PostDto>>>, ICacheableRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public Guid? UserId { get; set; }
        public Guid? GroupId { get; set; }
        public string? Status { get; set; }

        public string CacheKey => $"GetPosts_{PageNumber}_{PageSize}_{UserId}_{GroupId}_{Status}";
        public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
        public string? CacheTag => "Posts";
    }

    public class GetPostsQueryHandler : IRequestHandler<GetPostsQuery, Result<PaginatedList<PostDto>>>
    {
        private readonly IRepository<Post> _postRepository;

        public GetPostsQueryHandler(IRepository<Post> postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PaginatedList<PostDto>>> Handle(GetPostsQuery request, CancellationToken cancellationToken)
        {
            BaseSpecification<Post> specification;

            if (request.UserId.HasValue)
            {
                specification = new PostsByUserSpecification(request.UserId.Value);
            }
            else if (request.GroupId.HasValue)
            {
                specification = new PostsByGroupSpecification(request.GroupId.Value);
            }
            else
            {
                var skip = (request.PageNumber - 1) * request.PageSize;
                specification = new PublicPostsSpecification(skip, request.PageSize);
            }

            var posts = await _postRepository.ListAsync(specification, cancellationToken);
            var totalCount = await _postRepository.CountAsync(specification, cancellationToken);

            var postDtos = posts.Select(p => new PostDto
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
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                UserId = p.User.Id,
                UserFirstName = p.User.FirstName,
                UserLastName = p.User.LastName,
                UserProfileImageUrl = p.User.ProfileImageUrl,
                GroupId = p.GroupId,
                GroupName = p.Group?.Name
            }).ToList();

            var paginatedList = new PaginatedList<PostDto>(postDtos, totalCount, request.PageNumber, request.PageSize);
            return Result<PaginatedList<PostDto>>.Success(paginatedList);
        }
    }
}
