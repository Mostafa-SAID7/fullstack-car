using Domain.Enums.Identity;

namespace Application.Features.Admin.Management.Users.Users.DTOs.Requests
{
    public class SuspendUserRequest
    {
        public string Reason { get; set; } = string.Empty;
        public DateTime? SuspendUntil { get; set; }
        public bool IsPermanent { get; set; }
    }

    public class BanUserRequest
    {
        public string Reason { get; set; } = string.Empty;
        public bool IsPermanent { get; set; } = true;
    }

    public class DeleteUserRequest
    {
        public string Reason { get; set; } = string.Empty;
        public bool DeleteAllContent { get; set; }
    }

    public class SendMessageRequest
    {
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsUrgent { get; set; }
    }

    public class UpdateUserRolesRequest
    {
        public List<string> RoleNames { get; set; } = new();
    }

    public class ImpersonateUserRequest
    {
        public string Reason { get; set; } = string.Empty;
        public int DurationMinutes { get; set; } = 60;
    }
}