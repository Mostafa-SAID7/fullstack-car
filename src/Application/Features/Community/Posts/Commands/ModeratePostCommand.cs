using Application.Common.Models;
using Domain.Entities.Community.Posts;
using Domain.Enums.Community.Posts;
using Domain.Interfaces;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Posts.Commands
{
    public class ModeratePostCommand : IRequest<Result<bool>>
    {
        public Guid PostId { get; set; }
        public Guid ModeratorId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string? Reason { get; set; }
    }

    public class ModeratePostCommandHandler : IRequestHandler<ModeratePostCommand, Result<bool>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly ICacheService _cacheService;

        public ModeratePostCommandHandler(
            IRepository<Post> postRepository,
            ICacheService cacheService)
        {
            _postRepository = postRepository;
            _cacheService = cacheService;
        }

        public async Task<Result<bool>> Handle(ModeratePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post == null)
                return Result<bool>.Failure("Post not found");

            switch (request.Action.ToLower())
            {
                case "delete":
                    post.IsDeleted = true; // Soft delete or Hard delete depending on requirement. Assuming Soft.
                    break;
                case "hide":
                case "reject":
                case "flag":
                    post.Status = PostStatus.Flagged;
                    break;
                case "approve":
                    post.Status = PostStatus.Published;
                    break;
                default:
                    return Result<bool>.Failure($"Invalid moderation action: {request.Action}");
            }

            // You might want to log the reason or audit it. 
            // post.ModerationReason = request.Reason; // If entity has this field

            await _postRepository.UpdateAsync(post, cancellationToken);
            
            await _cacheService.RemoveAsync($"Post_{post.Id}", cancellationToken);
            await _cacheService.RemoveByTagAsync("Posts", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
