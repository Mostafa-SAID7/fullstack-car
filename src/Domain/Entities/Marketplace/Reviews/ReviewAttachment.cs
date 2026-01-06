namespace Domain.Entities.Marketplace.Reviews;

public class ReviewAttachment : BaseEntity
{
    public Guid ReviewId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string AttachmentType { get; set; } = string.Empty; // Photo, Video
    public string? Caption { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsApproved { get; set; } = true;

    // Navigation properties
    public ServiceReview Review { get; set; } = null!;
}
