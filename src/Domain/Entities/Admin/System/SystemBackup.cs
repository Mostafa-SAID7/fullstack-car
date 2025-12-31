using Domain.Entities.Identity;

namespace Domain.Entities.Admin.System;

public class SystemBackup : BaseEntity
{
    public string BackupType { get; set; } = string.Empty; // Full, Incremental, Differential
    public BackupStatus Status { get; set; } = BackupStatus.Pending;
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public long? FileSizeBytes { get; set; }
    public string? FilePath { get; set; }
    public string? ErrorMessage { get; set; }
    public Guid InitiatedByUserId { get; set; }
    public string? BackupMetadata { get; set; } // JSON with additional backup info
    public bool IsAutomatic { get; set; } = false;

    // Navigation properties
    public ApplicationUser InitiatedByUser { get; set; } = null!;
}