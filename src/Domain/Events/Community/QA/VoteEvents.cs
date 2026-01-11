using Domain.DomainEvents;

namespace Domain.Events.Community.QA;

/// <summary>
/// Domain event raised when a vote is created
/// </summary>
public class VoteCreatedEvent : BaseDomainEvent
{
    public Guid VoteId { get; }
    public Guid ContentId { get; }
    public string ContentType { get; } // "Question" or "Answer"
    public Guid UserId { get; }
    public string VoteType { get; } // "Up" or "Down"
    public Guid ContentAuthorId { get; }

    public VoteCreatedEvent(Guid voteId, Guid contentId, string contentType, Guid userId, string voteType, Guid contentAuthorId)
    {
        VoteId = voteId;
        ContentId = contentId;
        ContentType = contentType;
        UserId = userId;
        VoteType = voteType;
        ContentAuthorId = contentAuthorId;
    }
}

/// <summary>
/// Domain event raised when a vote is updated (changed from up to down or vice versa)
/// </summary>
public class VoteUpdatedEvent : BaseDomainEvent
{
    public Guid VoteId { get; }
    public Guid ContentId { get; }
    public string ContentType { get; }
    public Guid UserId { get; }
    public string PreviousVoteType { get; }
    public string NewVoteType { get; }
    public Guid ContentAuthorId { get; }

    public VoteUpdatedEvent(Guid voteId, Guid contentId, string contentType, Guid userId, 
        string previousVoteType, string newVoteType, Guid contentAuthorId)
    {
        VoteId = voteId;
        ContentId = contentId;
        ContentType = contentType;
        UserId = userId;
        PreviousVoteType = previousVoteType;
        NewVoteType = newVoteType;
        ContentAuthorId = contentAuthorId;
    }
}

/// <summary>
/// Domain event raised when a vote is deleted (removed)
/// </summary>
public class VoteDeletedEvent : BaseDomainEvent
{
    public Guid VoteId { get; }
    public Guid ContentId { get; }
    public string ContentType { get; }
    public Guid UserId { get; }
    public string VoteType { get; }
    public Guid ContentAuthorId { get; }

    public VoteDeletedEvent(Guid voteId, Guid contentId, string contentType, Guid userId, string voteType, Guid contentAuthorId)
    {
        VoteId = voteId;
        ContentId = contentId;
        ContentType = contentType;
        UserId = userId;
        VoteType = voteType;
        ContentAuthorId = contentAuthorId;
    }
}