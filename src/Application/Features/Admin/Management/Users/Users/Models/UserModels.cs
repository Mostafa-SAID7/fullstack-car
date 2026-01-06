using Domain.Enums.Identity;

namespace Application.Features.Admin.Management.Users.Users.Models
{
    public class AdminUser
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}".Trim();
        public string Email { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime? LastLogin { get; set; }
        public int PostsCount { get; set; }
        public int GroupsCount { get; set; }
        public int ReviewsCount { get; set; }
        public List<string> Roles { get; set; } = new();
        public UserStatus UserStatus { get; set; }
        public DateTime? SuspendedUntil { get; set; }
        public string? SuspensionReason { get; set; }
    }

    public class UserSummary
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}".Trim();
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List<string> Roles { get; set; } = new();
        public DateTime? LastLogin { get; set; }
    }
}