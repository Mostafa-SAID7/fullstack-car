namespace Domain.DomainEvents.Community.Posts;

public class PostLikedEvent : BaseDomainEvent
{
    public Guid PostId { get; }
    public Guid UserId { get; }
    public Guid AuthorId { get; }

    public PostLikedEvent(Guid postId, Guid userId, Guid authorId)
    {
        PostId = postId;
        UserId = userId;
        AuthorId = authorId;
    }
}
