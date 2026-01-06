using Application.Common.Models;
using MediatR;

namespace Application.Features.Admin.Management.Users.Permissions.Commands
{
    public class CreatePermissionCommand : IRequest<Result<Guid>>
    {
        public Guid AdminId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsSystemPermission { get; set; }
    }

    public class UpdatePermissionCommand : IRequest<Result<bool>>
    {
        public Guid AdminId { get; set; }
        public string PermissionName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }

    public class DeletePermissionCommand : IRequest<Result<bool>>
    {
        public Guid AdminId { get; set; }
        public string PermissionName { get; set; } = string.Empty;
    }
}