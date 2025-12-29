namespace Application.Features.Community.Posts.DTOs
{
    public class AddCommentRequest
    {
        public string Content { get; set; } = string.Empty;
        public Guid? ParentCommentId { get; set; }
    }
}