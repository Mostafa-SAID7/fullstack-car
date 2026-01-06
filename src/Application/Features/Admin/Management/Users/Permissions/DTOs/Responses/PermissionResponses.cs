namespace Application.Features.Admin.Management.Users.Permissions.DTOs.Responses
{
    public class PermissionResponse
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsSystemPermission { get; set; }
    }

    public class PermissionMatrix
    {
        public List<RolePermissionMatrix> Roles { get; set; } = new();
        public List<string> Permissions { get; set; } = new();
    }

    public class RolePermissionMatrix
    {
        public string RoleName { get; set; } = string.Empty;
        public Dictionary<string, bool> Permissions { get; set; } = new();
    }
}
