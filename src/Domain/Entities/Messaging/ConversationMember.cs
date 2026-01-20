using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Messaging
{
    public class ConversationMember : BaseAuditableEntity
    {
        public Guid ConversationId { get; set; }
        public virtual Conversation Conversation { get; set; } = null!;
        
        public Guid UserId { get; set; }
        public virtual ApplicationUser User { get; set; } = null!;
        
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastReadAt { get; set; }
    }
}