namespace Domain.Rules.Shared;

public class CacheKeyMustBeValidRule : BusinessRule
{
    private readonly string _key;

    public CacheKeyMustBeValidRule(string key)
    {
        _key = key;
    }

    public override string Message => "Cache key must be valid and not empty";

    public override bool IsBroken()
    {
        return string.IsNullOrWhiteSpace(_key) || 
               _key.Length > 250 || 
               _key.Contains(' ') ||
               _key.Any(c => char.IsControl(c));
    }
}