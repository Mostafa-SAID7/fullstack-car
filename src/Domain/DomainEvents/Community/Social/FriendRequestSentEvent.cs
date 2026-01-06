namespace Domain.DomainEvents.Community.Social;

public class FriendRequestSentEvent : BaseDomainEvent
{
    public Guid RequesterId { get; }
    public Guid ReceiverId { get; }
    public string RequesterName { get; }
    public string ReceiverName { get; }

    public FriendRequestSentEvent(Guid requesterId, Guid receiverId, string requesterName, string receiverName)
    {
        RequesterId = requesterId;
        ReceiverId = receiverId;
        RequesterName = requesterName;
        ReceiverName = receiverName;
    }
}
