namespace Domain.DomainEvents.Community.Groups;

public class GroupMemberJoinedEvent : BaseDomainEvent
{
    public Guid GroupId { get; }
    public Guid UserId { get; }
    public string GroupName { get; }
    public string UserName { get; }

    public GroupMemberJoinedEvent(Guid groupId, Guid userId, string groupName, string userName)
    {
        GroupId = groupId;
        UserId = userId;
        GroupName = groupName;
        UserName = userName;
    }
}