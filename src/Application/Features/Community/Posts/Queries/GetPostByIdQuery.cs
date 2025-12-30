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
    public class GetPostByIdQuery : IRequest<Result<PostDto>>, ICacheableRequest
    {
        public Guid Id { get; set; }

        public string CacheKey => $"Post_{Id}";
        public TimeSpan? Expiration => TimeSpan.FromMinutes(10);
        public string? CacheTag => "Posts";
    }

    public class GetPostByIdQueryHandler : IRequestHandler<GetPostByIdQuery, Result<PostDto>>
    {
        private readonly IRepository<Post> _postRepository;

        public GetPostByIdQueryHandler(IRepository<Post> postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task<Result<PostDto>> Handle(GetPostByIdQuery request, CancellationToken cancellationToken)
        {
            var specification = new PostWithDetailsSpecification(request.Id);
            var post = await _postRepository.FirstOrDefaultAsync(specification, cancellationToken);

            if (post == null)
            {
                return Result<PostDto>.Failure(new[] { "Post not found" });
            }

            var postDto = new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                ImageUrl = post.ImageUrl,
                Type = post.Type,
                Status = post.Status,
                ViewsCount = post.ViewsCount,
                LikesCount = post.LikesCount,
                CommentsCount = post.CommentsCount,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                UserId = post.User.Id,
                UserFirstName = post.User.FirstName,
                UserLastName = post.User.LastName,
                UserProfileImageUrl = post.User.ProfileImageUrl,
                GroupId = post.GroupId,
                GroupName = post.Group?.Name
            };

            return Result<PostDto>.Success(postDto);
        }
    }
}
