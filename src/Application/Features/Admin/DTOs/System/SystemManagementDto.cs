namespace Application.Features.Admin.DTOs.System
{
    public class SystemHealthDto
    {
        public string OverallStatus { get; set; } = string.Empty; // "Healthy", "Warning", "Critical"
        public DateTime LastChecked { get; set; }
        public List<ComponentHealthDto> Components { get; set; } = new();
        public SystemResourcesDto Resources { get; set; } = new();
        public List<SystemAlertDto> ActiveAlerts { get; set; } = new();
    }

    public class ComponentHealthDto
    {
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // "Healthy", "Warning", "Critical", "Unknown"
        public string Description { get; set; } = string.Empty;
        public TimeSpan ResponseTime { get; set; }
        public DateTime LastChecked { get; set; }
        public Dictionary<string, object> Metrics { get; set; } = new();
    }

    public class SystemResourcesDto
    {
        public CpuUsageDto CPU { get; set; } = new();
        public MemoryUsageDto Memory { get; set; } = new();
        public DiskUsageDto Disk { get; set; } = new();
        public NetworkUsageDto Network { get; set; } = new();
    }

    public class CpuUsageDto
    {
        public double CurrentUsage { get; set; }
        public double AverageUsage { get; set; }
        public double PeakUsage { get; set; }
        public int CoreCount { get; set; }
    }

    public class MemoryUsageDto
    {
        public long TotalMemory { get; set; }
        public long UsedMemory { get; set; }
        public long AvailableMemory { get; set; }
        public double UsagePercentage { get; set; }
        public long GCMemory { get; set; }
    }

    public class DiskUsageDto
    {
        public long TotalSpace { get; set; }
        public long UsedSpace { get; set; }
        public long FreeSpace { get; set; }
        public double UsagePercentage { get; set; }
        public List<DriveInfoDto> Drives { get; set; } = new();
    }

    public class DriveInfoDto
    {
        public string Name { get; set; } = string.Empty;
        public string DriveType { get; set; } = string.Empty;
        public long TotalSize { get; set; }
        public long AvailableSpace { get; set; }
        public double UsagePercentage { get; set; }
    }

    public class NetworkUsageDto
    {
        public long BytesSent { get; set; }
        public long BytesReceived { get; set; }
        public double SendRate { get; set; }
        public double ReceiveRate { get; set; }
        public int ActiveConnections { get; set; }
    }

    public class SystemAlertDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty; // "Info", "Warning", "Error", "Critical"
        public string Category { get; set; } = string.Empty; // "System", "Database", "Network", "Security"
        public DateTime CreatedAt { get; set; }
        public bool IsAcknowledged { get; set; }
        public Guid? AcknowledgedBy { get; set; }
        public DateTime? AcknowledgedAt { get; set; }
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class SystemConfigurationDto
    {
        public string Environment { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public TimeSpan Uptime { get; set; }
        public Dictionary<string, string> Settings { get; set; } = new();
        public List<FeatureFlagDto> FeatureFlags { get; set; } = new();
        public List<ServiceStatusDto> Services { get; set; } = new();
    }

    public class FeatureFlagDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public string Environment { get; set; } = string.Empty;
        public DateTime? EnabledAt { get; set; }
        public Guid? EnabledBy { get; set; }
    }

    public class ServiceStatusDto
    {
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public DateTime LastChecked { get; set; }
        public TimeSpan ResponseTime { get; set; }
        public string Endpoint { get; set; } = string.Empty;
    }

    public class AuditLogDto
    {
        public Guid Id { get; set; }
        public string Action { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public Dictionary<string, object> OldValues { get; set; } = new();
        public Dictionary<string, object> NewValues { get; set; } = new();
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class BackupInfoDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Full", "Incremental", "Differential"
        public long Size { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = string.Empty; // "Completed", "Failed", "InProgress"
        public string Location { get; set; } = string.Empty;
        public TimeSpan Duration { get; set; }
        public string? ErrorMessage { get; set; }
    }

    // Request DTOs
    public class CreateBackupRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "Full";
        public bool IncludeFiles { get; set; } = true;
        public bool CompressBackup { get; set; } = true;
        public string? Description { get; set; }
    }

    public class UpdateSystemSettingRequest
    {
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class ToggleFeatureFlagRequest
    {
        public bool IsEnabled { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class AcknowledgeAlertRequest
    {
        public string Notes { get; set; } = string.Empty;
    }

    public class SystemMaintenanceRequest
    {
        public string Type { get; set; } = string.Empty; // "Restart", "ClearCache", "OptimizeDatabase", "CleanupLogs"
        public DateTime? ScheduledTime { get; set; }
        public string Reason { get; set; } = string.Empty;
        public bool NotifyUsers { get; set; } = true;
        public int EstimatedDurationMinutes { get; set; } = 30;
    }
}