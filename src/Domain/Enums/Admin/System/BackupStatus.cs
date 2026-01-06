namespace Domain.Enums.Admin.System;

public enum BackupStatus
{
    Pending = 1,
    InProgress = 2,
    Completed = 3,
    Failed = 4,
    Cancelled = 5,
    Corrupted = 6,
    Restored = 7
}
