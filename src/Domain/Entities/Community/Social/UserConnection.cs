using Domain.Base;
using Domain.Enums.Community.Social;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Social
{
    public class UserConnection : BaseEntity
    {
        public Guid RequesterId { get; set; }
        public Guid ReceiverId { get; set; }
        public ConnectionType ConnectionType { get; set; } = ConnectionType.Friend;
        public ConnectionStatus Status { get; set; } = ConnectionStatus.Pending;
        public DateTime? AcceptedAt { get; set; }

        // Navigation Properties
        public virtual ApplicationUser Requester { get; set; } = null!;
        public virtual ApplicationUser Receiver { get; set; } = null!;
    }
}