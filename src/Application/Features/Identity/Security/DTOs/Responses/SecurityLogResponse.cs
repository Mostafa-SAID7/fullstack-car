namespace Application.Features.Identity.Security.DTOs.Responses
{
    public class SecurityLogResponse
    {
        public Guid Id { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsSuccessful { get; set; }
        public string? AdditionalData { get; set; }
    }
}
