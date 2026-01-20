using Microsoft.AspNetCore.Identity;
using Domain.Enums.Identity;
using Domain.Entities.Community.Posts;
using Domain.Entities.Community.Groups;
using Domain.Entities.Community.Reviews;
using Domain.Entities.Community.Social;
using Domain.Entities.Profile;

namespace Domain.Entities.Identity
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        // Profile Information
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Bio { get; set; }
        public string? Location { get; set; }
        public string? Website { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public bool IsPrivateProfile { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }
        public DateTime? LastActiveAt { get; set; }
        public string? NotificationPreferences { get; set; } // JSON
        public string? PrivacySettings { get; set; } // JSON
        
        // Account Status
        public bool IsActive { get; set; } = true;
        public UserStatus Status { get; set; } = UserStatus.Active;
        public DateTime? SuspendedUntil { get; set; }
        public string? SuspensionReason { get; set; }
        
        // Localization Preferences
        public string PreferredLanguage { get; set; } = "en-US";
        public bool IsRTLPreferred { get; set; } = false;
        
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
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public virtual ICollection<PostLike> PostLikes { get; set; } = new List<PostLike>();
        public virtual ICollection<CommentLike> CommentLikes { get; set; } = new List<CommentLike>();
        public virtual ICollection<Group> Groups { get; set; } = new List<Group>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
        public virtual ICollection<UserFriend> Friends { get; set; } = new List<UserFriend>();
        public virtual ICollection<UserFriend> FriendOf { get; set; } = new List<UserFriend>();
        public virtual ICollection<UserConnection> SentConnections { get; set; } = new List<UserConnection>();
        public virtual ICollection<UserConnection> ReceivedConnections { get; set; } = new List<UserConnection>();
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public virtual ICollection<GroupMember> GroupMemberships { get; set; } = new List<GroupMember>();
        public virtual ICollection<UserClaim> Claims { get; set; } = new List<UserClaim>();
        public virtual ICollection<UserSession> Sessions { get; set; } = new List<UserSession>();
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
