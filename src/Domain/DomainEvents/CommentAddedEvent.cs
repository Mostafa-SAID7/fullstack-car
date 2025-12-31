namespace Domain.DomainEvents
{
    public class CommentAddedEvent : BaseDomainEvent
    {
        public Guid CommentId { get; }
        public Guid PostId { get; }
        public Guid UserId { get; }
        public Guid PostAuthorId { get; }
        public string Content { get; }

        public CommentAddedEvent(Guid commentId, Guid postId, Guid userId, Guid postAuthorId, string content)
        {
            CommentId = commentId;
            PostId = postId;
            UserId = userId;
            PostAuthorId = postAuthorId;
            Content = content;
        }
    }
}