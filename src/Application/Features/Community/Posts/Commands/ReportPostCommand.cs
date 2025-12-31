using Application.Common.Models;
using Application.Features.Community.Posts.DTOs;
using Domain.Entities.Community.Posts;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Posts.Commands
{
    public class ReportPostCommand : IRequest<Result<bool>>
    {
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
        public ReportPostRequest Request { get; set; } = null!;
    }

    public class ReportPostCommandHandler : IRequestHandler<ReportPostCommand, Result<bool>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly IRepository<PostReport> _reportRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ReportPostCommandHandler(
            IRepository<Post> postRepository,
            IRepository<PostReport> reportRepository,
            IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _reportRepository = reportRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(ReportPostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post == null)
            {
                return Result<bool>.Failure(new[] { "Post not found" });
            }

            var report = new PostReport
            {
                PostId = request.PostId,
                ReportedBy = request.UserId,
                Reason = request.Request.Reason,
                Category = request.Request.Category
            };

            await _reportRepository.AddAsync(report, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
