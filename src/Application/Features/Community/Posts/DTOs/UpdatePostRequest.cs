using Domain.Enums.Community.Posts;

namespace Application.Features.Community.Posts.DTOs
{
    public class UpdatePostRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public PostType Type { get; set; }
        public PostStatus Status { get; set; }
    }
}