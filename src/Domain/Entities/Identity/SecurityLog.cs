using System;

namespace Domain.Entities.Identity
{
    public class SecurityLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public bool IsSuccessful { get; set; }
        public string? AdditionalData { get; set; }

        // Navigation property
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
