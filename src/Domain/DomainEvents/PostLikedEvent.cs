namespace Domain.DomainEvents
{
    public class PostLikedEvent : BaseDomainEvent
    {
        public Guid PostId { get; }
        public Guid UserId { get; }
        public Guid PostAuthorId { get; }

        public PostLikedEvent(Guid postId, Guid userId, Guid postAuthorId)
        {
            PostId = postId;
            UserId = userId;
            PostAuthorId = postAuthorId;
        }
    }
}