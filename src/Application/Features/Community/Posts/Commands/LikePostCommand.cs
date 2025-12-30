using Application.Common.Models;
using Domain.Entities.Community.Posts;
using Domain.Interfaces;
using Application.Common.Interfaces.Communication;
using Domain.Entities.Identity;
using Application.Common.Interfaces.Caching;
using MediatR;

namespace Application.Features.Community.Posts.Commands
{
    public class LikePostCommand : IRequest<Result<bool>>
    {
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
    }

    public class LikePostCommandHandler : IRequestHandler<LikePostCommand, Result<bool>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly IRepository<PostLike> _likeRepository;
        private readonly IRepository<ApplicationUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private readonly INotificationService _notificationService;

        public LikePostCommandHandler(
            IRepository<Post> postRepository,
            IRepository<PostLike> likeRepository,
            IRepository<ApplicationUser> userRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService,
            INotificationService notificationService)
        {
            _postRepository = postRepository;
            _likeRepository = likeRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
            _notificationService = notificationService;
        }

        public async Task<Result<bool>> Handle(LikePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post == null)
            {
                return Result<bool>.Failure(new[] { "Post not found" });
            }

            // Check if already liked
            var existingLike = (await _likeRepository.GetAllAsync(cancellationToken))
                .FirstOrDefault(l => l.PostId == request.PostId && l.UserId == request.UserId);

            if (existingLike != null)
            {
                return Result<bool>.Failure(new[] { "Post already liked" });
            }

            var like = new PostLike
            {
                PostId = request.PostId,
                UserId = request.UserId
            };

            await _likeRepository.AddAsync(like, cancellationToken);
            post.LikesCount++;
            await _postRepository.UpdateAsync(post, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Send notification
            if (post.UserId != request.UserId)
            {
                var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
                var userName = user != null ? $"{user.FirstName} {user.LastName}" : "Someone";
                await _notificationService.SendNotificationAsync(
                    post.UserId.ToString(),
                    "New Post Like",
                    $"{userName} liked your post: {post.Title}",
                    $"/posts/{post.Id}",
                    request.UserId,
                    cancellationToken);
            }

            await _cacheService.RemoveAsync($"Post_{post.Id}", cancellationToken);
            await _cacheService.RemoveByTagAsync("Posts", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
