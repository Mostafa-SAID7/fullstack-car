namespace Application.Features.Community.Posts.DTOs
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public int LikesCount { get; set; }
        public int RepliesCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Guid UserId { get; set; }
        public string UserFirstName { get; set; } = string.Empty;
        public string UserLastName { get; set; } = string.Empty;
        public string? UserProfileImageUrl { get; set; }

        public Guid? ParentCommentId { get; set; }
    }
}
