namespace Domain.ValueObjects.Shared;

public class ErrorContext : ValueObject
{
    public string Source { get; private set; }
    public string? Method { get; private set; }
    public string? RequestPath { get; private set; }
    public Guid? UserId { get; private set; }
    public string? SessionId { get; private set; }
    public string? CorrelationId { get; private set; }
    public Dictionary<string, object> AdditionalData { get; private set; }

    private ErrorContext()
    {
        Source = string.Empty;
        AdditionalData = new Dictionary<string, object>();
    } // For EF Core

    public ErrorContext(string source, string? method = null, string? requestPath = null,
        Guid? userId = null, string? sessionId = null, string? correlationId = null,
        Dictionary<string, object>? additionalData = null)
    {
        if (string.IsNullOrWhiteSpace(source))
            throw new ArgumentException("Error source cannot be empty", nameof(source));

        Source = source;
        Method = method;
        RequestPath = requestPath;
        UserId = userId;
        SessionId = sessionId;
        CorrelationId = correlationId;
        AdditionalData = additionalData ?? new Dictionary<string, object>();
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Source;
        yield return Method ?? string.Empty;
        yield return RequestPath ?? string.Empty;
        yield return UserId?.ToString() ?? string.Empty;
        yield return SessionId ?? string.Empty;
        yield return CorrelationId ?? string.Empty;
        
        foreach (var data in AdditionalData.OrderBy(x => x.Key))
        {
            yield return data.Key;
            yield return data.Value;
        }
    }
}
