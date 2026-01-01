namespace Domain.Entities.Shared.Attachments;

public class Attachment : BaseEntity
{
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? EntityId { get; set; }
    public string? EntityType { get; set; }
    public bool IsPublic { get; set; } = false;
    public string? Tags { get; set; }
    public DateTime? ExpiresAt { get; set; }
    
    // Additional properties expected by Infrastructure
    public string? FileUrl { get; set; }
}