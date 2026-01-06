namespace Domain.Rules.Shared;

public class ErrorMustHaveValidSeverityRule : BusinessRule
{
    private readonly ErrorSeverity _severity;
    private readonly string _message;

    public ErrorMustHaveValidSeverityRule(ErrorSeverity severity, string message)
    {
        _severity = severity;
        _message = message;
    }

    public override string Message => "Error must have valid severity based on message content";

    public override bool IsBroken()
    {
        // Critical keywords should have high severity
        var criticalKeywords = new[] { "fatal", "crash", "corruption", "security", "breach" };
        var hasCriticalKeyword = criticalKeywords.Any(keyword => 
            _message.Contains(keyword, StringComparison.OrdinalIgnoreCase));

        if (hasCriticalKeyword && _severity < ErrorSeverity.High)
            return true;

        // Warning keywords should not have fatal severity
        var warningKeywords = new[] { "warning", "deprecated", "slow" };
        var hasWarningKeyword = warningKeywords.Any(keyword => 
            _message.Contains(keyword, StringComparison.OrdinalIgnoreCase));

        if (hasWarningKeyword && _severity == ErrorSeverity.Fatal)
            return true;

        return false;
    }
}
