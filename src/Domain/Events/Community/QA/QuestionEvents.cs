using Domain.DomainEvents;

namespace Domain.Events.Community.QA;

/// <summary>
/// Domain event raised when a question is created
/// </summary>
public class QuestionCreatedEvent : BaseDomainEvent
{
    public Guid QuestionId { get; }
    public Guid UserId { get; }
    public string Category { get; }
    public List<string> Tags { get; }
    public bool HasSimilarQuestions { get; }

    public QuestionCreatedEvent(Guid questionId, Guid userId, string category, List<string> tags, bool hasSimilarQuestions)
    {
        QuestionId = questionId;
        UserId = userId;
        Category = category;
        Tags = tags;
        HasSimilarQuestions = hasSimilarQuestions;
    }
}

/// <summary>
/// Domain event raised when a question is updated
/// </summary>
public class QuestionUpdatedEvent : BaseDomainEvent
{
    public Guid QuestionId { get; }
    public Guid UserId { get; }
    public string? PreviousTitle { get; }
    public string? NewTitle { get; }
    public List<string> UpdatedFields { get; }

    public QuestionUpdatedEvent(Guid questionId, Guid userId, string? previousTitle, string? newTitle, List<string> updatedFields)
    {
        QuestionId = questionId;
        UserId = userId;
        PreviousTitle = previousTitle;
        NewTitle = newTitle;
        UpdatedFields = updatedFields;
    }
}

/// <summary>
/// Domain event raised when a question is deleted
/// </summary>
public class QuestionDeletedEvent : BaseDomainEvent
{
    public Guid QuestionId { get; }
    public Guid UserId { get; }
    public string Reason { get; }

    public QuestionDeletedEvent(Guid questionId, Guid userId, string reason)
    {
        QuestionId = questionId;
        UserId = userId;
        Reason = reason;
    }
}

/// <summary>
/// Domain event raised when a question is closed
/// </summary>
public class QuestionClosedEvent : BaseDomainEvent
{
    public Guid QuestionId { get; }
    public Guid ClosedByUserId { get; }
    public string Reason { get; }

    public QuestionClosedEvent(Guid questionId, Guid closedByUserId, string reason)
    {
        QuestionId = questionId;
        ClosedByUserId = closedByUserId;
        Reason = reason;
    }
}

/// <summary>
/// Domain event raised when a question is reopened
/// </summary>
public class QuestionReopenedEvent : BaseDomainEvent
{
    public Guid QuestionId { get; }
    public Guid ReopenedByUserId { get; }

    public QuestionReopenedEvent(Guid questionId, Guid reopenedByUserId)
    {
        QuestionId = questionId;
        ReopenedByUserId = reopenedByUserId;
    }
}