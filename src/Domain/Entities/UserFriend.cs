using Domain.Base;
using Domain.Enums;

namespace Domain.Entities
{
    public class UserFriend : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid FriendId { get; set; }
        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;
        public DateTime? AcceptedAt { get; set; }
        
        // Navigation Properties
        public virtual User User { get; set; } = null!;
        public virtual User Friend { get; set; } = null!;
    }
}