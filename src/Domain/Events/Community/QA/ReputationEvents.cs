using Domain.DomainEvents;

namespace Domain.Events.Community.QA;

/// <summary>
/// Domain event raised when a user's reputation is updated
/// </summary>
public class ReputationUpdatedEvent : BaseDomainEvent
{
    public Guid UserId { get; }
    public int PreviousReputation { get; }
    public int NewReputation { get; }
    public int Change { get; }
    public string Reason { get; }
    public string? SourceContentId { get; }
    public string? SourceContentType { get; }

    public ReputationUpdatedEvent(Guid userId, int previousReputation, int newReputation, int change, string reason, string? sourceContentId = null, string? sourceContentType = null)
    {
        UserId = userId;
        PreviousReputation = previousReputation;
        NewReputation = newReputation;
        Change = change;
        Reason = reason;
        SourceContentId = sourceContentId;
        SourceContentType = sourceContentType;
    }
}

/// <summary>
/// Domain event raised when badges are earned by a user
/// </summary>
public class BadgesEarnedEvent : BaseDomainEvent
{
    public Guid UserId { get; }
    public List<string> BadgesEarned { get; }
    public int CurrentReputationScore { get; }
    public string Reason { get; }

    public BadgesEarnedEvent(Guid userId, List<string> badgesEarned, int currentReputationScore, string reason)
    {
        UserId = userId;
        BadgesEarned = badgesEarned;
        CurrentReputationScore = currentReputationScore;
        Reason = reason;
    }
}