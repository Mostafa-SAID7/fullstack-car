namespace Domain.DomainEvents.Community.Groups;

public class GroupCreatedEvent : BaseDomainEvent
{
    public Guid GroupId { get; }
    public string GroupName { get; }
    public Guid CreatedByUserId { get; }
    public bool IsPublic { get; }

    public GroupCreatedEvent(Guid groupId, string groupName, Guid createdByUserId, bool isPublic)
    {
        GroupId = groupId;
        GroupName = groupName;
        CreatedByUserId = createdByUserId;
        IsPublic = isPublic;
    }
}
