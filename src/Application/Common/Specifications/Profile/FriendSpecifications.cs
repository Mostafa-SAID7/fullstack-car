using Application.Common.Specifications;
using Domain.Entities.Profile;
using Domain.Enums.Community.Social;

namespace Application.Common.Specifications.Profile
{
    public class FriendsListSpecification : BaseSpecification<UserFriend>
    {
        public FriendsListSpecification(Guid userId, int skip, int take) 
            : base(f => (f.UserId == userId || f.FriendId == userId) && f.Status == FriendshipStatus.Accepted)
        {
            AddInclude(f => f.User);
            AddInclude(f => f.Friend);
            ApplyOrderByDescending(f => f.AcceptedAt ?? DateTime.MinValue);
            ApplyPaging(skip, take);
        }
    }

    public class FriendRequestsSpecification : BaseSpecification<UserFriend>
    {
        public FriendRequestsSpecification(Guid userId, int skip, int take) 
            : base(f => f.FriendId == userId && f.Status == FriendshipStatus.Pending)
        {
            AddInclude(f => f.User);
            ApplyOrderByDescending(f => f.CreatedAt);
            ApplyPaging(skip, take);
        }
    }

    public class FriendshipExistenceSpecification : BaseSpecification<UserFriend>
    {
        public FriendshipExistenceSpecification(Guid userId, Guid friendId) 
            : base(f => (f.UserId == userId && f.FriendId == friendId) || (f.UserId == friendId && f.FriendId == userId))
        {
        }
    }
}
