using Application.Common.Models;
using Domain.Entities.Community.Posts;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Posts.Commands
{
    public class DeletePostCommand : IRequest<Result<bool>>
    {
        public Guid PostId { get; set; }
        public string? DeletedBy { get; set; }
    }

    public class DeletePostCommandHandler : IRequestHandler<DeletePostCommand, Result<bool>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeletePostCommandHandler(IRepository<Post> postRepository, IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(DeletePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post == null)
            {
                return Result<bool>.Failure(new[] { "Post not found" });
            }

            await _postRepository.DeleteAsync(post, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}