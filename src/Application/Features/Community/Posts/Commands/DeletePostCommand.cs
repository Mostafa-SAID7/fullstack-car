using Application.Common.Models;
using Domain.Entities.Community.Posts;
using Domain.Interfaces;
using Domain.Policies;
using Domain.Entities.Identity;
using Application.Features.Shared.Interfaces.Caching;
using MediatR;

namespace Application.Features.Community.Posts.Commands
{
    public class DeletePostCommand : IRequest<Result<bool>>
    {
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
    }

    public class DeletePostCommandHandler : IRequestHandler<DeletePostCommand, Result<bool>>
    {
        private readonly IRepository<Post> _postRepository;
        private readonly IRepository<ApplicationUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public DeletePostCommandHandler(
            IRepository<Post> postRepository, 
            IRepository<ApplicationUser> userRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService)
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<bool>> Handle(DeletePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _postRepository.GetByIdAsync(request.PostId, cancellationToken);
            if (post == null)
            {
                return Result<bool>.Failure(new[] { "Post not found" });
            }

            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            if (user == null)
            {
                return Result<bool>.Failure(new[] { "User not found" });
            }

            if (!PostPolicy.CanDelete(post, user))
            {
                return Result<bool>.Failure(new[] { "You are not authorized to delete this post" });
            }

            await _postRepository.DeleteAsync(post, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _cacheService.RemoveAsync($"Post_{post.Id}", cancellationToken);
            await _cacheService.RemoveByTagAsync("Posts", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
