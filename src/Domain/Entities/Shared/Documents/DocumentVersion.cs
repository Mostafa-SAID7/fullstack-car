namespace Domain.Entities.Shared.Documents;

public class DocumentVersion : BaseEntity
{
    public Guid DocumentId { get; set; }
    public int VersionNumber { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string? ChangeDescription { get; set; }
    public string? Checksum { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Document Document { get; set; } = null!;
}
