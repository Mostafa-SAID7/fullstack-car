namespace Application.Features.Identity.Security.DTOs.Responses
{
    public class UserSessionResponse
    {
        public string SessionId { get; set; } = string.Empty;
        public string? DeviceInfo { get; set; }
        public string? IpAddress { get; set; }
        public string? Location { get; set; }
        public DateTime LastActivity { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsCurrentSession { get; set; }
        public bool IsActive { get; set; }
    }
}