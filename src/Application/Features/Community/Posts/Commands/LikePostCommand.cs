using Application.Common.Models;
using Domain.Entities.Community.Posts;
using Domain.Interfaces;
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
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public LikePostCommandHandler(
            IRepository<Post> postRepository,
            IRepository<PostLike> likeRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService)
        {
            _postRepository = postRepository;
            _likeRepository = likeRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<bool>> Handle(LikePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post == null)
            {
                return Result<bool>.Failure(new[] { "Post not found" });
            }

            // Check if already liked using a simple check for now
            // In a real app, we'd use a specification or a unique constraint catch
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

            await _cacheService.RemoveAsync($"Post_{post.Id}", cancellationToken);
            await _cacheService.RemoveByTagAsync("Posts", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
