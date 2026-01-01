namespace Domain.DomainEvents.Community.Posts;

public class CommentAddedEvent : BaseDomainEvent
{
    public Guid CommentId { get; }
    public Guid PostId { get; }
    public Guid AuthorId { get; }
    public Guid PostAuthorId { get; }
    public string Content { get; }

    public CommentAddedEvent(Guid commentId, Guid postId, Guid authorId, Guid postAuthorId, string content)
    {
        CommentId = commentId;
        PostId = postId;
        AuthorId = authorId;
        PostAuthorId = postAuthorId;
        Content = content;
    }
}