namespace Application.Features.Community.Posts.DTOs
{
    public class AddCommentRequest
    {
        public string Content { get; set; } = string.Empty;
        public Guid? ParentCommentId { get; set; }
    }

    public class UpdateCommentRequest
    {
        public string Content { get; set; } = string.Empty;
    }

    public class ReportCommentRequest
    {
        public string Reason { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
