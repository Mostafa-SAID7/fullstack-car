namespace Application.Features.Shared.Caching.Interfaces;

public interface ICacheInvalidatorRequest
{
    string[]? CacheKeysToInvalidate { get; }
    string[]? CacheTagsToInvalidate { get; }
}