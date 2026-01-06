using Domain.Base;

namespace Domain.Entities.Media;

public class PodcastComment : BaseEntity
{
    public string Content { get; set; } = string.Empty;
    public Guid PodcastId { get; set; }
    public Guid UserId { get; set; }
    public Guid? ParentCommentId { get; set; }
    public int LikeCount { get; set; } = 0;
    public bool IsEdited { get; set; } = false;
    public DateTime? EditedAt { get; set; }
    
    // Navigation properties
    public virtual Podcast Podcast { get; set; } = null!;
    public virtual PodcastComment? ParentComment { get; set; }
    public virtual ICollection<PodcastComment> Replies { get; set; } = new List<PodcastComment>();
    public virtual ICollection<PodcastCommentLike> Likes { get; set; } = new List<PodcastCommentLike>();
}
