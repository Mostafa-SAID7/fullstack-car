namespace Domain.Enums.Admin.Management;

public enum AdminActionType
{
    UserSuspension = 1,
    UserActivation = 2,
    RoleAssignment = 3,
    RoleRevocation = 4,
    PermissionGrant = 5,
    PermissionRevoke = 6,
    AccountDeletion = 7,
    DataExport = 8,
    SystemConfiguration = 9,
    ContentModeration = 10
}
