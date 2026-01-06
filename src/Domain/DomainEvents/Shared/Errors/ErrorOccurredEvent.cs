namespace Domain.DomainEvents.Shared.Errors;

public class ErrorOccurredEvent : BaseDomainEvent
{
    public string ErrorId { get; }
    public string Message { get; }
    public ErrorSeverity Severity { get; }
    public string Source { get; }
    public Guid? UserId { get; }
    public ErrorContext Context { get; }

    public ErrorOccurredEvent(string errorId, string message, ErrorSeverity severity, 
        string source, Guid? userId, ErrorContext context)
    {
        ErrorId = errorId;
        Message = message;
        Severity = severity;
        Source = source;
        UserId = userId;
        Context = context;
    }
}
