using System;

namespace Application.Features.Shared.Caching.DTOs.Requests
{
    public class CacheRequest
    {
        public string Key { get; set; } = string.Empty;
        public TimeSpan? Expiration { get; set; }
        public string? Tag { get; set; }
    }
}