namespace Domain.Enums.Admin.System;

public enum AuditActionType
{
    Create = 1,
    Read = 2,
    Update = 3,
    Delete = 4,
    Login = 5,
    Logout = 6,
    PasswordChange = 7,
    PermissionChange = 8,
    ConfigurationChange = 9,
    DataExport = 10,
    DataImport = 11,
    SystemBackup = 12,
    SystemRestore = 13
}