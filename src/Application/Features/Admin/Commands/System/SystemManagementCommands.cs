using Application.Common.Models;
using MediatR;

namespace Application.Features.Admin.Commands.System
{
    public class AcknowledgeAlertCommand : IRequest<Result<bool>>
    {
        public Guid AlertId { get; set; }
        public Guid AdminId { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    public class ToggleFeatureFlagCommand : IRequest<Result<bool>>
    {
        public string FlagName { get; set; } = string.Empty;
        public bool IsEnabled { get; set; }
        public Guid AdminId { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class UpdateSystemSettingCommand : IRequest<Result<bool>>
    {
        public Guid AdminId { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class ScheduleMaintenanceCommand : IRequest<Result<Guid>>
    {
        public Guid AdminId { get; set; }
        public string Type { get; set; } = string.Empty;
        public DateTime? ScheduledTime { get; set; }
        public string Reason { get; set; } = string.Empty;
        public bool NotifyUsers { get; set; } = true;
        public int EstimatedDurationMinutes { get; set; } = 30;
    }

    public class CreateBackupCommand : IRequest<Result<Guid>>
    {
        public Guid AdminId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "Full";
        public bool IncludeFiles { get; set; } = true;
        public bool CompressBackup { get; set; } = true;
        public string? Description { get; set; }
    }
}
    public class RestoreBackupCommand : IRequest<Result<Guid>>
    {
        public Guid BackupId { get; set; }
        public Guid AdminId { get; set; }
        public string RestoreType { get; set; } = "Full";
        public string? TargetLocation { get; set; }
        public bool OverwriteExisting { get; set; } = false;
    }

    public class DeleteBackupCommand : IRequest<Result<bool>>
    {
        public Guid BackupId { get; set; }
        public Guid AdminId { get; set; }
    }

    public class ScheduleBackupCommand : IRequest<Result<Guid>>
    {
        public Guid AdminId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "Full";
        public string Schedule { get; set; } = string.Empty;
        public int RetentionDays { get; set; } = 30;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateBackupScheduleCommand : IRequest<Result<bool>>
    {
        public Guid ScheduleId { get; set; }
        public Guid AdminId { get; set; }
        public string Schedule { get; set; } = string.Empty;
        public int RetentionDays { get; set; } = 30;
        public bool IsActive { get; set; } = true;
    }