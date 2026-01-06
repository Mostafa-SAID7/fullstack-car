namespace Domain.Entities.Shared.Caching;

public class CacheEntry : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public string? Tags { get; set; }
    public long SizeInBytes { get; set; }
    public int HitCount { get; set; } = 0;
    public DateTime LastAccessedAt { get; set; } = DateTime.UtcNow;
    public string? Region { get; set; }
    public Priority Priority { get; set; } = Priority.Normal;
}
