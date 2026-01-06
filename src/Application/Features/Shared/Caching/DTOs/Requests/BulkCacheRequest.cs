using System;
using System.Collections.Generic;

namespace Application.Features.Shared.Caching.DTOs.Requests
{
    public class BulkCacheRequest<T>
    {
        public Dictionary<string, T> KeyValuePairs { get; set; } = new();
        public TimeSpan? Expiration { get; set; }
        public string? Tag { get; set; }
    }
}
