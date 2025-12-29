using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Shared.Chat
{
    public class Conversation : BaseAuditableEntity
    {
        public string? Title { get; set; }
        public bool IsGroup { get; set; } = false;
        
        public Guid? LastMessageId { get; set; }
        public DateTime? LastMessageAt { get; set; }
        
        // Relationships
        public virtual ICollection<ConversationMember> Members { get; set; } = new List<ConversationMember>();
        public virtual ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
    }
}
