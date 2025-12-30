using Microsoft.AspNetCore.Identity;
using Domain.Enums.Identity;
using Domain.Entities.Community.Posts;
using Domain.Entities.Community.Groups;
using Domain.Entities.Community.Reviews;
using Domain.Entities.Community.Social;

namespace Domain.Entities.Identity
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        // Profile Information
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public string? Bio { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }
        
        // Account Status
        public bool IsActive { get; set; } = true;
        public UserStatus Status { get; set; } = UserStatus.Active;
        public DateTime? SuspendedUntil { get; set; }
        public string? SuspensionReason { get; set; }
        
        // Security & Privacy
        public bool IsEmailPublic { get; set; } = false;
        public bool IsPhonePublic { get; set; } = false;
        public bool AllowDirectMessages { get; set; } = true;
        public bool ShowOnlineStatus { get; set; } = true;
        
        // OAuth & External Logins
        public string? ExternalProvider { get; set; }
        public string? ExternalProviderId { get; set; }
        
        // Computed Properties
        public string FullName => $"{FirstName} {LastName}".Trim();
        public bool IsSuspended => SuspendedUntil.HasValue && SuspendedUntil > DateTime.UtcNow;
        public bool IsVerified => EmailConfirmed && PhoneNumberConfirmed;

        // Navigation Properties
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
        public virtual ICollection<Group> Groups { get; set; } = new List<Group>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
        public virtual ICollection<UserFriend> Friends { get; set; } = new List<UserFriend>();
        public virtual ICollection<UserFriend> FriendOf { get; set; } = new List<UserFriend>();
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public virtual ICollection<GroupMember> GroupMemberships { get; set; } = new List<GroupMember>();
        public virtual ICollection<UserClaim> Claims { get; set; } = new List<UserClaim>();
        public virtual ICollection<UserSession> Sessions { get; set; } = new List<UserSession>();
    }
}