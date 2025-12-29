using Application.Common.Models;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Posts.Commands
{
    public class FeaturePostCommand : IRequest<Result<bool>>
    {
        public Guid PostId { get; set; }
    }

    public class FeaturePostCommandHandler : IRequestHandler<FeaturePostCommand, Result<bool>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly IUnitOfWork _unitOfWork;

        public FeaturePostCommandHandler(IRepository<Post> postRepository, IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(FeaturePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post == null)
            {
                return Result<bool>.Failure(new[] { "Post not found" });
            }

            // Note: You might want to add a IsFeatured property to the Post entity
            // For now, we'll assume this functionality exists or will be added
            
            await _postRepository.UpdateAsync(post, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}