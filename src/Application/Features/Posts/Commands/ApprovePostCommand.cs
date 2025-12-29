using Application.Common.Models;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Posts.Commands
{
    public class ApprovePostCommand : IRequest<Result<bool>>
    {
        public Guid PostId { get; set; }
        public string ApprovedBy { get; set; } = string.Empty;
        public string? ApprovalNotes { get; set; }
    }

    public class ApprovePostCommandHandler : IRequestHandler<ApprovePostCommand, Result<bool>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ApprovePostCommandHandler(
            IRepository<Post> postRepository,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(ApprovePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post == null)
            {
                return Result<bool>.Failure(new[] { "Post not found" });
            }

            if (post.Status == PostStatus.Published)
            {
                return Result<bool>.Failure(new[] { "Post is already approved" });
            }

            post.Status = PostStatus.Published;
            post.UpdatedAt = DateTime.UtcNow;
            post.UpdatedBy = request.ApprovedBy;

            await _postRepository.UpdateAsync(post, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}