using Application.Common.Models;
using Application.Features.Admin.DTOs.Management;
using MediatR;

namespace Application.Features.Admin.Queries.Management
{
    public class GetAvailablePermissionsQuery : IRequest<Result<List<PermissionDto>>>
    {
        public string? Category { get; set; }
    }
}