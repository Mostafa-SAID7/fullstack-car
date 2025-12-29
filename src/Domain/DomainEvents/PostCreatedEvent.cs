namespace Domain.DomainEvents
{
    public class PostCreatedEvent : BaseDomainEvent
    {
        public Guid PostId { get; }
        public Guid UserId { get; }
        public string Title { get; }
        public Guid? GroupId { get; }

        public PostCreatedEvent(Guid postId, Guid userId, string title, Guid? groupId = null)
        {
            PostId = postId;
            UserId = userId;
            Title = title;
            GroupId = groupId;
        }
    }
}