namespace Domain.DomainEvents.Shared;

public class CacheEvictedEvent : BaseDomainEvent
{
    public string Key { get; }
    public string? Region { get; }
    public string Reason { get; }

    public CacheEvictedEvent(string key, string? region, string reason)
    {
        Key = key;
        Region = region;
        Reason = reason;
    }
}