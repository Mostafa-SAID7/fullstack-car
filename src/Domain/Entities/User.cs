using Domain.Base;
using Domain.Enums;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class User : BaseAuditableEntity
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public string? Bio { get; set; }
        public UserStatus Status { get; set; } = UserStatus.Active;
        public DateTime? LastLoginAt { get; set; }
        
        // Navigation Properties
        public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
        public virtual ICollection<Group> Groups { get; set; } = new List<Group>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
        public virtual ICollection<UserFriend> Friends { get; set; } = new List<UserFriend>();
        public virtual ICollection<UserFriend> FriendOf { get; set; } = new List<UserFriend>();
    }
}