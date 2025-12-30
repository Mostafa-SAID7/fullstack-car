using Domain.Enums.Community.Posts;

namespace Application.Features.Community.Posts.DTOs
{
    public class PostDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public PostType Type { get; set; }
        public PostStatus Status { get; set; }
        public int ViewsCount { get; set; }
        public int LikesCount { get; set; }
        public int CommentsCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Guid UserId { get; set; }
        public string UserFirstName { get; set; } = string.Empty;
        public string UserLastName { get; set; } = string.Empty;
        public string? UserProfileImageUrl { get; set; }

        public Guid? GroupId { get; set; }
        public string? GroupName { get; set; }
    }
}
