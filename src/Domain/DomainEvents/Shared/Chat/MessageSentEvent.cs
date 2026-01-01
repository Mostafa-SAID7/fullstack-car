namespace Domain.DomainEvents.Shared.Chat;

public class MessageSentEvent : BaseDomainEvent
{
    public Guid MessageId { get; }
    public Guid ConversationId { get; }
    public Guid SenderId { get; }
    public string Content { get; }
    public MessageType MessageType { get; }

    public MessageSentEvent(Guid messageId, Guid conversationId, Guid senderId, string content, MessageType messageType)
    {
        MessageId = messageId;
        ConversationId = conversationId;
        SenderId = senderId;
        Content = content;
        MessageType = messageType;
    }
}