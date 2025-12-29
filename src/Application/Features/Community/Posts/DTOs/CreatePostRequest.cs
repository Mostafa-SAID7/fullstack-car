using Domain.Enums;

namespace Application.Features.Community.Posts.DTOs
{
    public class CreatePostRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public PostType Type { get; set; }
        public Guid? GroupId { get; set; }
    }
}