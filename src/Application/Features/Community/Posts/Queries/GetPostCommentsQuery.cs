using Application.Common.Models;
using Application.Features.Community.Posts.DTOs;
using Domain.Entities.Community.Posts;
using Domain.Interfaces;
using Application.Common.Specifications.Community.Posts;
using Application.Common.Interfaces.Caching;
using MediatR;

namespace Application.Features.Community.Posts.Queries
{
    public class GetPostCommentsQuery : IRequest<Result<PaginatedList<CommentDto>>>, ICacheableRequest
    {
        public Guid PostId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public string CacheKey => $"Comments_{PostId}_{PageNumber}_{PageSize}";
        public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
        public string? CacheTag => $"Comments_{PostId}";
    }

    public class GetPostCommentsQueryHandler : IRequestHandler<GetPostCommentsQuery, Result<PaginatedList<CommentDto>>>
    {
        private readonly IRepository<Comment> _commentRepository;

        public GetPostCommentsQueryHandler(IRepository<Comment> commentRepository)
        {
            _commentRepository = commentRepository;
        }

        public async Task<Result<PaginatedList<CommentDto>>> Handle(GetPostCommentsQuery request, CancellationToken cancellationToken)
        {
            var skip = (request.PageNumber - 1) * request.PageSize;
            var specification = new PostCommentsSpecification(request.PostId, skip, request.PageSize);

            var comments = await _commentRepository.ListAsync(specification, cancellationToken);
            var totalCount = await _commentRepository.CountAsync(specification, cancellationToken);

            var commentDtos = comments.Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                LikesCount = c.LikesCount,
                RepliesCount = c.RepliesCount,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                UserId = c.User.Id,
                UserFirstName = c.User.FirstName,
                UserLastName = c.User.LastName,
                UserProfileImageUrl = c.User.ProfileImageUrl,
                ParentCommentId = c.ParentCommentId
            }).ToList();

            var paginatedList = new PaginatedList<CommentDto>(commentDtos, totalCount, request.PageNumber, request.PageSize);
            return Result<PaginatedList<CommentDto>>.Success(paginatedList);
        }
    }
}
