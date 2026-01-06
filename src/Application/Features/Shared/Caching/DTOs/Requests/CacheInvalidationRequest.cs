namespace Application.Features.Shared.Caching.DTOs.Requests
{
    public class CacheInvalidationRequest
    {
        public string[] Tags { get; set; } = Array.Empty<string>();
        public string? Pattern { get; set; }
        public string? EntityType { get; set; }
        public string? EntityId { get; set; }
    }
}
