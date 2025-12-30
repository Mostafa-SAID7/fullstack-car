using Application.Common.Models;
using Domain.Entities.Community.Posts;
using Domain.Entities.Identity;
using Domain.Enums.Community.Posts;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Posts.Commands
{
    public class RejectPostCommand : IRequest<Result<bool>>
    {
        public Guid PostId { get; set; }
        public string RejectedBy { get; set; } = string.Empty;
        public string RejectionReason { get; set; } = string.Empty;
    }

    public class RejectPostCommandHandler : IRequestHandler<RejectPostCommand, Result<bool>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RejectPostCommandHandler(
            IRepository<Post> postRepository,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(RejectPostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post == null)
            {
                return Result<bool>.Failure(new[] { "Post not found" });
            }

            if (post.Status == PostStatus.Flagged)
            {
                return Result<bool>.Failure(new[] { "Post is already rejected" });
            }

            post.Status = PostStatus.Flagged;
            post.UpdatedAt = DateTime.UtcNow;
            post.UpdatedBy = request.RejectedBy;

            await _postRepository.UpdateAsync(post, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
