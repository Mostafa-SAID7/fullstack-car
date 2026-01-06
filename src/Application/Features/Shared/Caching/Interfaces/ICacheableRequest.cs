namespace Application.Features.Shared.Caching.Interfaces;

public interface ICacheableRequest
{
    string CacheKey { get; }
    TimeSpan? CacheExpiration { get; }
    string[]? CacheTags { get; }
}
