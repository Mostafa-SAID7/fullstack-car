using Domain.Enums.Admin.Moderation;

namespace Domain.ValueObjects.Admin;

public class ModerationDecision : ValueObject
{
    public ModerationActionType Action { get; }
    public string Reason { get; }
    public string? Notes { get; }
    public DateTime DecisionDate { get; }
    public int SeverityLevel { get; }

    public ModerationDecision(ModerationActionType action, string reason, string? notes, 
        DateTime decisionDate, int severityLevel = 1)
    {
        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Reason cannot be empty", nameof(reason));

        if (severityLevel < 1 || severityLevel > 10)
            throw new ArgumentException("Severity level must be between 1 and 10", nameof(severityLevel));

        Action = action;
        Reason = reason;
        Notes = notes;
        DecisionDate = decisionDate;
        SeverityLevel = severityLevel;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Action;
        yield return Reason;
        yield return Notes ?? string.Empty;
        yield return DecisionDate;
        yield return SeverityLevel;
    }
}