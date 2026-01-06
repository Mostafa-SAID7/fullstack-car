using Domain.Enums.Admin.Moderation;

namespace Domain.DomainEvents.Admin.Moderation;

public class ContentModeratedEvent : BaseDomainEvent
{
    public Guid ContentId { get; }
    public ContentType ContentType { get; }
    public ModerationActionType Action { get; }
    public Guid ModeratedByUserId { get; }
    public string Reason { get; }

    public ContentModeratedEvent(Guid contentId, ContentType contentType, 
        ModerationActionType action, Guid moderatedByUserId, string reason)
    {
        ContentId = contentId;
        ContentType = contentType;
        Action = action;
        ModeratedByUserId = moderatedByUserId;
        Reason = reason;
    }
}
