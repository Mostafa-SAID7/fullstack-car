namespace Application.Features.Shared.Caching.DTOs.Responses
{
    public class CacheResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Key { get; set; }
        public bool IsFromCache { get; set; }
        public DateTime? CachedAt { get; set; }
        public TimeSpan? TimeToLive { get; set; }
    }
}
