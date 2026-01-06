namespace Domain.Rules.Shared;

public class SearchQueryMustBeValidRule : BusinessRule
{
    private readonly string _query;

    public SearchQueryMustBeValidRule(string query)
    {
        _query = query;
    }

    public override string Message => "Search query must be valid";

    public override bool IsBroken()
    {
        if (string.IsNullOrWhiteSpace(_query))
            return true;

        if (_query.Length < 2)
            return true;

        if (_query.Length > 500)
            return true;

        // Check for potentially malicious patterns
        var maliciousPatterns = new[] { "<script", "javascript:", "vbscript:", "onload=", "onerror=" };
        return maliciousPatterns.Any(pattern => _query.Contains(pattern, StringComparison.OrdinalIgnoreCase));
    }
}
