using Application.Common.Models;
using Application.Features.Community.Posts.DTOs;
using Domain.Entities.Community.Posts;
using Domain.Interfaces;
using Domain.Policies;
using Domain.Entities.Identity;
using Application.Common.Interfaces.Caching;
using MediatR;

namespace Application.Features.Community.Posts.Commands
{
    public class UpdatePostCommand : IRequest<Result<PostDto>>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public UpdatePostRequest Request { get; set; } = null!;
    }

    public class UpdatePostCommandHandler : IRequestHandler<UpdatePostCommand, Result<PostDto>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly IRepository<ApplicationUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public UpdatePostCommandHandler(
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

        public async Task<Result<PostDto>> Handle(UpdatePostCommand command, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(command.Id, cancellationToken);
            if (post == null)
            {
                return Result<PostDto>.Failure(new[] { "Post not found" });
            }

            var user = await _userRepository.GetByIdAsync(command.UserId, cancellationToken);
            if (user == null)
            {
                return Result<PostDto>.Failure(new[] { "User not found" });
            }

            if (!PostPolicy.CanEdit(post, user))
            {
                return Result<PostDto>.Failure(new[] { "You are not authorized to edit this post" });
            }

            post.Title = command.Request.Title;
            post.Content = command.Request.Content;
            post.ImageUrl = command.Request.ImageUrl;
            post.Type = command.Request.Type;
            post.Status = command.Request.Status;

            await _postRepository.UpdateAsync(post, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _cacheService.RemoveAsync($"Post_{post.Id}", cancellationToken);
            await _cacheService.RemoveByTagAsync("Posts", cancellationToken);

            var postDto = new PostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                ImageUrl = post.ImageUrl,
                Type = post.Type,
                Status = post.Status,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                UserId = user.Id,
                UserFirstName = user.FirstName,
                UserLastName = user.LastName,
                UserProfileImageUrl = user.ProfileImageUrl,
                GroupId = post.GroupId
            };

            return Result<PostDto>.Success(postDto);
        }
    }
}
