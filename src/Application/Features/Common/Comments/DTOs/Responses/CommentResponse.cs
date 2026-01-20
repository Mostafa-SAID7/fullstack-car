using Domain.Enums.Common;

namespace Application.Features.Common.Comments.DTOs.Responses;

public class CommentResponse
{
    public Guid Id { get; set; }
    public Guid ContentId { get; set; }
    public ContentType ContentType { get; set; }
    public Guid UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
    public int LikeCount { get; set; }
    public int ReplyCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UserName { get; set; }
    public string? UserAvatar { get; set; }
    public bool IsEdited { get; set; }
    public List<CommentResponse> Replies { get; set; } = new();
}