using System;

namespace Application.Common.Interfaces.Caching
{
    public interface ICacheableRequest
    {
        string CacheKey { get; }
        TimeSpan? Expiration { get; }
        string? CacheTag { get; }
    }
}
