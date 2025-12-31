using System;

namespace Application.Features.Shared.Caching.Interfaces
{
    public interface ICacheableRequest
    {
        string CacheKey { get; }
        TimeSpan? Expiration { get; }
        string? CacheTag { get; }
    }
}