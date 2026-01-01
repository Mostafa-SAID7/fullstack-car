namespace Domain.Entities.Shared.Documents;

public class Document : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? Tags { get; set; }
    public bool IsPublic { get; set; } = false;
    public Guid? OwnerId { get; set; }
    public int Version { get; set; } = 1;
    public string? Checksum { get; set; }
    public DateTime? ExpiresAt { get; set; }
}