namespace Application.Features.Admin.Management.Users.Permissions.DTOs.Requests
{
    public class CreatePermissionRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsSystemPermission { get; set; }
    }

    public class UpdatePermissionRequest
    {
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }
}
