using Application.Common.Models;
using Application.Features.Admin.Management.Users.Permissions.DTOs.Responses;
using Application.Features.Admin.Management.Users.Roles.DTOs.Responses;
using Application.Features.Admin.Management.Users.Users.Models;
using MediatR;

namespace Application.Features.Admin.Management.Users.Permissions.Queries
{
    public class GetAvailablePermissionsQuery : IRequest<Result<List<PermissionResponse>>>
    {
        public string? Category { get; set; }
    }

    public class GetPermissionCategoriesQuery : IRequest<Result<List<string>>>
    {
    }

    public class GetPermissionByNameQuery : IRequest<Result<PermissionResponse>>
    {
        public string PermissionName { get; set; } = string.Empty;
    }

    public class GetRolesWithPermissionQuery : IRequest<Result<List<RoleResponse>>>
    {
        public string PermissionName { get; set; } = string.Empty;
    }

    public class GetUsersWithPermissionQuery : IRequest<Result<PaginatedList<UserSummary>>>
    {
        public string PermissionName { get; set; } = string.Empty;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class GetPermissionMatrixQuery : IRequest<Result<PermissionMatrix>>
    {
    }
}