using Application.Common.Models;
using Application.Features.Community.Posts.DTOs;
using Domain.Entities.Community.Posts;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Application.Common.Interfaces.Caching;
using Application.Common.Interfaces.Communication;
using MediatR;

namespace Application.Features.Community.Posts.Commands
{
    public class AddCommentCommand : IRequest<Result<bool>>
    {
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
        public AddCommentRequest Request { get; set; } = null!;
    }

    public class AddCommentCommandHandler : IRequestHandler<AddCommentCommand, Result<bool>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly IRepository<Comment> _commentRepository;
        private readonly IRepository<ApplicationUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private readonly INotificationService _notificationService;

        public AddCommentCommandHandler(
            IRepository<Post> postRepository,
            IRepository<Comment> commentRepository,
            IRepository<ApplicationUser> userRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService,
            INotificationService notificationService)
        {
            _postRepository = postRepository;
            _commentRepository = commentRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
            _notificationService = notificationService;
        }

        public async Task<Result<bool>> Handle(AddCommentCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post == null)
            {
                return Result<bool>.Failure(new[] { "Post not found" });
            }

            var comment = new Comment
            {
                PostId = request.PostId,
                UserId = request.UserId,
                Content = request.Request.Content,
                ParentCommentId = request.Request.ParentCommentId
            };

            await _commentRepository.AddAsync(comment, cancellationToken);
            post.CommentsCount++;
            await _postRepository.UpdateAsync(post, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Send notification
            if (post.UserId != request.UserId)
            {
                var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
                var userName = user != null ? $"{user.FirstName} {user.LastName}" : "Someone";
                await _notificationService.SendNotificationAsync(
                    post.UserId.ToString(),
                    "New Comment",
                    $"{userName} commented on your post: {post.Title}",
                    $"/posts/{post.Id}",
                    request.UserId,
                    cancellationToken);
            }

            await _cacheService.RemoveAsync($"Post_{post.Id}", cancellationToken);
            await _cacheService.RemoveByTagAsync("Posts", cancellationToken);
            await _cacheService.RemoveByTagAsync($"Comments_{post.Id}", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
