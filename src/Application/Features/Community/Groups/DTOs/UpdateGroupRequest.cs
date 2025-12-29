using Domain.Enums.Community.Groups;

namespace Application.Features.Community.Groups.DTOs
{
    public class UpdateGroupRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public GroupPrivacy Privacy { get; set; }
    }
}
