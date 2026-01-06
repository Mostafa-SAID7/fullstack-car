using Application.Common.Models;
using Domain.Entities.Community.Posts;

namespace Application.Features.Community.Posts.Interfaces
{
    public interface IPostService
    {
        Task<Result<Post>> GetPostByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result<PaginatedList<Post>>> GetPostsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        Task<Result<Post>> CreatePostAsync(Post post, CancellationToken cancellationToken = default);
        Task<Result<Post>> UpdatePostAsync(Post post, CancellationToken cancellationToken = default);
        Task<Result> DeletePostAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Result> LikePostAsync(Guid postId, Guid userId, CancellationToken cancellationToken = default);
        Task<Result> UnlikePostAsync(Guid postId, Guid userId, CancellationToken cancellationToken = default);
        Task<Result> ReportPostAsync(Guid postId, Guid userId, string reason, CancellationToken cancellationToken = default);
    }
}
