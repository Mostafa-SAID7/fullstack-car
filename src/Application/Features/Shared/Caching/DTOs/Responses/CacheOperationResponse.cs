namespace Application.Features.Shared.Caching.DTOs.Responses
{
    public class CacheOperationResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? Key { get; set; }
        public int AffectedKeys { get; set; }
        public TimeSpan Duration { get; set; }
    }
}