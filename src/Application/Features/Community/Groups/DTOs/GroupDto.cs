using Domain.Enums.Community.Groups;

namespace Application.Features.Community.Groups.DTOs
{
    public class GroupDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public GroupType Type { get; set; }
        public GroupPrivacy Privacy { get; set; }
        public int MembersCount { get; set; }
        public int PostsCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Guid OwnerId { get; set; }
        public string OwnerFirstName { get; set; } = string.Empty;
        public string OwnerLastName { get; set; } = string.Empty;
        public string? OwnerProfileImageUrl { get; set; }
    }
}
