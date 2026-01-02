using Domain.Base;

namespace Domain.Entities.Media;

public class VideoComment : BaseEntity
{
    public string Content { get; set; } = string.Empty;
    public Guid VideoId { get; set; }
    public Guid UserId { get; set; }
    public Guid? ParentCommentId { get; set; }
    public int LikeCount { get; set; } = 0;
    public bool IsEdited { get; set; } = false;
    public DateTime? EditedAt { get; set; }
    
    // Navigation properties
    public virtual Video Video { get; set; } = null!;
    public virtual VideoComment? ParentComment { get; set; }
    public virtual ICollection<VideoComment> Replies { get; set; } = new List<VideoComment>();
    public virtual ICollection<VideoCommentLike> Likes { get; set; } = new List<VideoCommentLike>();
}