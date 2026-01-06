namespace Domain.DomainEvents.Community.Posts;

public class PostCreatedEvent : BaseDomainEvent
{
    public Guid PostId { get; }
    public Guid AuthorId { get; }
    public string Title { get; }
    public string Content { get; }

    public PostCreatedEvent(Guid postId, Guid authorId, string title, string content)
    {
        PostId = postId;
        AuthorId = authorId;
        Title = title;
        Content = content;
    }
}
