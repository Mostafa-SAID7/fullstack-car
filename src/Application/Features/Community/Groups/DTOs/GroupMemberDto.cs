using Domain.Enums.Community.Groups;

namespace Application.Features.Community.Groups.DTOs
{
    public class GroupMemberDto
    {
        public Guid UserId { get; set; }
        public string UserFirstName { get; set; } = string.Empty;
        public string UserLastName { get; set; } = string.Empty;
        public string? UserProfileImageUrl { get; set; }
        public GroupMemberRole Role { get; set; }
        public DateTime JoinedAt { get; set; }
    }
}
