using Application.Common.Models;
using Domain.Entities.Community.Posts;
using Domain.Interfaces;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Posts.Commands
{
    public class UnlikePostCommand : IRequest<Result<bool>>
    {
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
    }

    public class UnlikePostCommandHandler : IRequestHandler<UnlikePostCommand, Result<bool>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly IRepository<PostLike> _likeRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public UnlikePostCommandHandler(
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

        public async Task<Result<bool>> Handle(UnlikePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post == null)
            {
                return Result<bool>.Failure(new[] { "Post not found" });
            }

            var existingLike = (await _likeRepository.GetAllAsync(cancellationToken))
                .FirstOrDefault(l => l.PostId == request.PostId && l.UserId == request.UserId);

            if (existingLike == null)
            {
                return Result<bool>.Failure(new[] { "Post not liked" });
            }

            await _likeRepository.DeleteAsync(existingLike, cancellationToken);
            post.LikesCount = Math.Max(0, post.LikesCount - 1);
            await _postRepository.UpdateAsync(post, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _cacheService.RemoveAsync($"Post_{post.Id}", cancellationToken);
            await _cacheService.RemoveByTagAsync("Posts", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
