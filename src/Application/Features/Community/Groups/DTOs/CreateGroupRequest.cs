using Domain.Enums.Community.Groups;

namespace Application.Features.Community.Groups.DTOs
{
    public class CreateGroupRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public GroupType Type { get; set; }
        public GroupPrivacy Privacy { get; set; }
    }
}
