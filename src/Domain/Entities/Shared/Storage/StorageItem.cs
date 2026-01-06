namespace Domain.Entities.Shared.Storage;

public class StorageItem : BaseEntity
{
    public string FileName { get; set; } = string.Empty;
    public string OriginalFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string StoragePath { get; set; } = string.Empty;
    public string? Container { get; set; }
    public string? Bucket { get; set; }
    public string? Checksum { get; set; }
    public string? Metadata { get; set; } // JSON
    public bool IsPublic { get; set; } = false;
    public DateTime? ExpiresAt { get; set; }
    public Guid? OwnerId { get; set; }
    public string? Tags { get; set; }
}
