using Domain.Base;
using Domain.Entities.Identity;
using Domain.Enums.Shared.Chat;

namespace Domain.Entities.Messaging
{
    public class ChatMessage : BaseAuditableEntity
    {
        public Guid ConversationId { get; set; }
        public virtual Conversation Conversation { get; set; } = null!;

        public Guid SenderId { get; set; }
        public virtual ApplicationUser Sender { get; set; } = null!;

        public string Content { get; set; } = string.Empty;
        public MessageType Type { get; set; } = MessageType.Text;

        public bool IsEdited { get; set; } = false;
        public bool IsDeletedBySender { get; set; } = false;
    }
}