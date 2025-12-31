using Application.Common.Models;
using Application.Features.Admin.DTOs.Management;
using MediatR;

namespace Application.Features.Admin.Queries.Management
{
    public class GetRolesQuery : IRequest<Result<PaginatedList<RoleDto>>>
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public bool? IsSystemRole { get; set; }
    }
}