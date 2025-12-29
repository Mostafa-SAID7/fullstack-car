using Application.Common.Models;
using Application.Features.Posts.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Posts.Queries
{
    public class GetPostByIdQuery : IRequest<Result<PostDto>>
    {
        public Guid Id { get; set; }
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
            var post = await _postRepository.GetByIdAsync(request.Id, cancellationToken);
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
                UserId = post.UserId,
                GroupId = post.GroupId,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt
            };

            return Result<PostDto>.Success(postDto);
        }
    }
}