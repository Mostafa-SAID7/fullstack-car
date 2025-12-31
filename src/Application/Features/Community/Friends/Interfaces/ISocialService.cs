using Application.Common.Models;
using Domain.Entities.Community.Social;

namespace Application.Features.Community.Friends.Interfaces
{
    public interface ISocialService
    {
        Task<Result> SendFriendRequestAsync(Guid fromUserId, Guid toUserId, CancellationToken cancellationToken = default);
        Task<Result> AcceptFriendRequestAsync(Guid requestId, CancellationToken cancellationToken = default);
        Task<Result> RejectFriendRequestAsync(Guid requestId, CancellationToken cancellationToken = default);
        Task<Result> RemoveFriendAsync(Guid userId, Guid friendId, CancellationToken cancellationToken = default);
        Task<Result<PaginatedList<UserFriend>>> GetFriendsAsync(Guid userId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        Task<Result<PaginatedList<UserFriend>>> GetFriendRequestsAsync(Guid userId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
        Task<Result<bool>> AreFriendsAsync(Guid userId1, Guid userId2, CancellationToken cancellationToken = default);
    }
}