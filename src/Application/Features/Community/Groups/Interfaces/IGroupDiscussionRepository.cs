using Application.Common.DTOs;
using Domain.Entities.Community.Groups;

namespace Application.Features.Community.Groups.Interfaces
{
    public interface IGroupDiscussionRepository : IRepository<GroupDiscussion>
    {
        // Discussion queries
        Task<GroupDiscussion?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<GroupDiscussion?> GetByIdWithRepliesAsync(Guid id, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupDiscussion>> GetGroupDiscussionsAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupDiscussion>> GetPinnedDiscussionsAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupDiscussion>> GetDiscussionsByCategoryAsync(Guid groupId, string category, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupDiscussion>> GetRecentDiscussionsAsync(Guid groupId, int count, CancellationToken cancellationToken = default);

        // Paginated queries
        Task<PaginatedResult<GroupDiscussion>> GetGroupDiscussionsPagedAsync(
            Guid groupId,
            int pageNumber,
            int pageSize,
            string? category = null,
            string? sortBy = null,
            bool sortDescending = true,
            bool? isPinned = null,
            CancellationToken cancellationToken = default);

        // Discussion statistics
        Task<int> GetDiscussionCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<int> GetActiveDiscussionCountAsync(Guid groupId, CancellationToken cancellationToken = default);
        Task<Dictionary<string, int>> GetDiscussionCountsByCategoryAsync(Guid groupId, CancellationToken cancellationToken = default);

        // Discussion validation
        Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> IsUserCreatorAsync(Guid discussionId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> CanUserModerateAsync(Guid discussionId, Guid userId, CancellationToken cancellationToken = default);

        // Discussion operations
        Task<bool> PinDiscussionAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> UnpinDiscussionAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> LockDiscussionAsync(Guid id, string reason, Guid lockedBy, DateTime? lockUntil = null, CancellationToken cancellationToken = default);
        Task<bool> UnlockDiscussionAsync(Guid id, CancellationToken cancellationToken = default);
        Task<bool> IncrementViewCountAsync(Guid id, CancellationToken cancellationToken = default);

        // Poll operations
        Task AddPollOptionAsync(GroupDiscussionPollOption option, CancellationToken cancellationToken = default);
        Task<IEnumerable<GroupDiscussionPollOption>> GetPollOptionsAsync(Guid discussionId, CancellationToken cancellationToken = default);
        Task<bool> VoteOnPollAsync(Guid optionId, Guid userId, CancellationToken cancellationToken = default);
        Task<bool> RemovePollVoteAsync(Guid optionId, Guid userId, CancellationToken cancellationToken = default);

        // Reply operations
        Task<IEnumerable<GroupDiscussionReply>> GetDiscussionRepliesAsync(Guid discussionId, CancellationToken cancellationToken = default);
        Task<PaginatedResult<GroupDiscussionReply>> GetDiscussionRepliesPagedAsync(
            Guid discussionId,
            int pageNumber,
            int pageSize,
            string? sortBy = null,
            bool sortDescending = false,
            CancellationToken cancellationToken = default);
        Task AddReplyAsync(GroupDiscussionReply reply, CancellationToken cancellationToken = default);
    }
}
