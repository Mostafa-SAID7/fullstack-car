using Domain.Enums;

namespace Application.Features.Posts.DTOs
{
    public class UpdatePostRequest
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public PostType Type { get; set; }
        public PostStatus Status { get; set; }
    }
}