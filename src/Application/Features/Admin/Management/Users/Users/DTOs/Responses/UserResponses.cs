using Application.Features.Admin.Management.Users.Users.Models;
using Application.Features.Admin.Management.Users.Activities.Models;
using Application.Features.Admin.Management.Users.Reports.Models;

namespace Application.Features.Admin.Management.Users.Users.DTOs.Responses
{
    public class UserListResponse
    {
        public List<AdminUser> Users { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }

    public class UserDetailResponse
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime? LastLogin { get; set; }
        public int PostsCount { get; set; }
        public int GroupsCount { get; set; }
        public int ReviewsCount { get; set; }
        public List<string> Roles { get; set; } = new();
        public Domain.Enums.Identity.UserStatus UserStatus { get; set; }
        public DateTime? SuspendedUntil { get; set; }
        public string? SuspensionReason { get; set; }
        public List<UserActivity> RecentActivity { get; set; } = new();
        public List<UserReport> Reports { get; set; } = new();
    }

    public class UserActionResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public Dictionary<string, object> Data { get; set; } = new();
    }
}
