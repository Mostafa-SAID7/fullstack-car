using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Chat
{
    public class ChatMessage : BaseAuditableEntity
    {
        public Guid ConversationId { get; set; }
        public virtual Conversation Conversation { get; set; } = null!;
        
        public Guid SenderId { get; set; }
        public virtual User Sender { get; set; } = null!;
        
        public string Content { get; set; } = string.Empty;
        public MessageType Type { get; set; } = MessageType.Text;
        
        public bool IsEdited { get; set; } = false;
        public bool IsDeletedBySender { get; set; } = false;
    }

    public enum MessageType
    {
        Text = 1,
        Image = 2,
        File = 3,
        System = 4
    }
}
