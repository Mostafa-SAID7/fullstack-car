using Domain.DomainEvents;

namespace Domain.Events.Community.QA;

/// <summary>
/// Domain event raised when an answer is created
/// </summary>
public class AnswerCreatedEvent : BaseDomainEvent
{
    public Guid AnswerId { get; }
    public Guid QuestionId { get; }
    public Guid UserId { get; }
    public Guid QuestionAuthorId { get; }

    public AnswerCreatedEvent(Guid answerId, Guid questionId, Guid userId, Guid questionAuthorId)
    {
        AnswerId = answerId;
        QuestionId = questionId;
        UserId = userId;
        QuestionAuthorId = questionAuthorId;
    }
}

/// <summary>
/// Domain event raised when an answer is updated
/// </summary>
public class AnswerUpdatedEvent : BaseDomainEvent
{
    public Guid AnswerId { get; }
    public Guid QuestionId { get; }
    public Guid UserId { get; }
    public List<string> UpdatedFields { get; }

    public AnswerUpdatedEvent(Guid answerId, Guid questionId, Guid userId, List<string> updatedFields)
    {
        AnswerId = answerId;
        QuestionId = questionId;
        UserId = userId;
        UpdatedFields = updatedFields;
    }
}

/// <summary>
/// Domain event raised when an answer is deleted
/// </summary>
public class AnswerDeletedEvent : BaseDomainEvent
{
    public Guid AnswerId { get; }
    public Guid QuestionId { get; }
    public Guid UserId { get; }
    public string Reason { get; }

    public AnswerDeletedEvent(Guid answerId, Guid questionId, Guid userId, string reason)
    {
        AnswerId = answerId;
        QuestionId = questionId;
        UserId = userId;
        Reason = reason;
    }
}

/// <summary>
/// Domain event raised when an answer is accepted
/// </summary>
public class AnswerAcceptedEvent : BaseDomainEvent
{
    public Guid AnswerId { get; }
    public Guid QuestionId { get; }
    public Guid AnswerAuthorId { get; }
    public Guid QuestionAuthorId { get; }

    public AnswerAcceptedEvent(Guid answerId, Guid questionId, Guid answerAuthorId, Guid questionAuthorId)
    {
        AnswerId = answerId;
        QuestionId = questionId;
        AnswerAuthorId = answerAuthorId;
        QuestionAuthorId = questionAuthorId;
    }
}

/// <summary>
/// Domain event raised when an answer acceptance is revoked
/// </summary>
public class AnswerAcceptanceRevokedEvent : BaseDomainEvent
{
    public Guid AnswerId { get; }
    public Guid QuestionId { get; }
    public Guid AnswerAuthorId { get; }
    public Guid QuestionAuthorId { get; }

    public AnswerAcceptanceRevokedEvent(Guid answerId, Guid questionId, Guid answerAuthorId, Guid questionAuthorId)
    {
        AnswerId = answerId;
        QuestionId = questionId;
        AnswerAuthorId = answerAuthorId;
        QuestionAuthorId = questionAuthorId;
    }
}