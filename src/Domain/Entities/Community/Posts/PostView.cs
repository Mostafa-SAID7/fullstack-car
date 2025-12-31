using Domain.Entities.Identity;

namespace Domain.Entities.Community.Posts
{
    public class PostView
    {
        public Guid Id { get; set; }
        public Guid PostId { get; set; }
        public Guid? UserId { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
        public TimeSpan? Duration { get; set; }
        public string? ReferrerUrl { get; set; }

        // Navigation Properties
        public virtual Post Post { get; set; } = null!;
        public virtual ApplicationUser? User { get; set; }
    }
}