namespace Domain.ValueObjects.Shared;

public class CacheKey : ValueObject
{
    public string Key { get; private set; }
    public string? Region { get; private set; }

    private CacheKey()
    {
        Key = string.Empty;
    } // For EF Core

    public CacheKey(string key, string? region = null)
    {
        if (string.IsNullOrWhiteSpace(key))
            throw new ArgumentException("Cache key cannot be empty", nameof(key));
        
        if (key.Length > 250)
            throw new ArgumentException("Cache key cannot exceed 250 characters", nameof(key));

        Key = key;
        Region = region;
    }

    public string GetFullKey() => string.IsNullOrEmpty(Region) ? Key : $"{Region}:{Key}";

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Key;
        yield return Region ?? string.Empty;
    }

    public override string ToString() => GetFullKey();
}
