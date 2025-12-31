using Application.Common.Models;
using Application.Features.Community.Posts.DTOs;
using Domain.Entities.Community.Posts;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Application.Features.Shared.Interfaces.Caching;
using MediatR;

namespace Application.Features.Community.Posts.Commands
{
    public class CreatePostCommand : IRequest<Result<PostDto>>
    {
        public CreatePostRequest Request { get; set; } = null!;
        public Guid UserId { get; set; }
    }

    public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, Result<PostDto>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly IRepository<ApplicationUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public CreatePostCommandHandler(
            IRepository<Post> postRepository,
            IRepository<ApplicationUser> userRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<PostDto>> Handle(CreatePostCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(command.UserId, cancellationToken);
            if (user == null)
            {
                return Result<PostDto>.Failure(new[] { "User not found" });
            }

            var post = new Post
            {
                Title = command.Request.Title,
                Content = command.Request.Content,
                ImageUrl = command.Request.ImageUrl,
                Type = command.Request.Type,
                UserId = command.UserId,
                GroupId = command.Request.GroupId
            };

            await _postRepository.AddAsync(post, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

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
                UserId = user.Id,
                UserFirstName = user.FirstName,
                UserLastName = user.LastName,
                UserProfileImageUrl = user.ProfileImageUrl,
                GroupId = post.GroupId
            };

            await _cacheService.RemoveByTagAsync("Posts", cancellationToken);

            return Result<PostDto>.Success(postDto);
        }
    }
}
