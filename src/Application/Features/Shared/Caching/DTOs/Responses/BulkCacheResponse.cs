using System.Collections.Generic;

namespace Application.Features.Shared.Caching.DTOs.Responses
{
    public class BulkCacheResponse<T>
    {
        public bool Success { get; set; }
        public Dictionary<string, T?> Data { get; set; } = new();
        public int TotalRequested { get; set; }
        public int CacheHits { get; set; }
        public int CacheMisses { get; set; }
        public List<string> FailedKeys { get; set; } = new();
    }
}