using Application.Common.Models;
using Application.Features.Community.Posts.DTOs;
using Domain.Entities.Community.Posts;
using Domain.Interfaces;
using Application.Common.Interfaces.Caching;
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
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public AddCommentCommandHandler(
            IRepository<Post> postRepository,
            IRepository<Comment> commentRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService)
        {
            _postRepository = postRepository;
            _commentRepository = commentRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
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

            await _cacheService.RemoveAsync($"Post_{post.Id}", cancellationToken);
            await _cacheService.RemoveByTagAsync("Posts", cancellationToken);
            await _cacheService.RemoveByTagAsync($"Comments_{post.Id}", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
