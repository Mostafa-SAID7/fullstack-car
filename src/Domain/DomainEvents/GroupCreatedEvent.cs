namespace Domain.DomainEvents
{
    public class GroupCreatedEvent : BaseDomainEvent
    {
        public Guid GroupId { get; }
        public Guid CreatorId { get; }
        public string Name { get; }
        public string? Description { get; }

        public GroupCreatedEvent(Guid groupId, Guid creatorId, string name, string? description = null)
        {
            GroupId = groupId;
            CreatorId = creatorId;
            Name = name;
            Description = description;
        }
    }
}