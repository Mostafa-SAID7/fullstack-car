using Application.Common.DTOs;
using Domain.Entities.Community.Events;

namespace Application.Features.Community.Events.Interfaces
{
    public interface IEventCommentRepository : IRepository<EventComment>
    {
        // Comment queries
        Task<EventComment?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventComment>> GetEventCommentsAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventComment>> GetEventCommentsWithRepliesAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventComment>> GetCommentRepliesAsync(Guid parentCommentId, CancellationToken cancellationToken = default);
        Task<IEnumerable<EventComment>> GetUserCommentsAsync(Guid userId, CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<EventComment>> GetEventCommentsPagedAsync(
            Guid eventId,
            int pageNumber,
            int pageSize,
            string? sortBy = null,
            bool sortDescending = false,
            CancellationToken cancellationToken = default);

        // Comment statistics
        Task<int> GetEventCommentCountAsync(Guid eventId, CancellationToken cancellationToken = default);
        Task<int> GetCommentReplyCountAsync(Guid commentId, CancellationToken cancellationToken = default);
        Task<int> GetUserCommentCountAsync(Guid userId, CancellationToken cancellationToken = default);

        // Comment validation
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> IsUserCommentOwnerAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> CanUserEditCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default);

        // Comment operations
        Task<bool> UpdateCommentAsync(EventComment comment, CancellationToken cancellationToken = default);
        Task<bool> DeleteCommentAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> SoftDeleteCommentAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> LikeCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> UnlikeCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> HasUserLikedCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default);
    }
}