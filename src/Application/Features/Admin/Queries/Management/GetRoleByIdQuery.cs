using Application.Common.Models;
using Application.Features.Admin.DTOs.Management;
using MediatR;

namespace Application.Features.Admin.Queries.Management
{
    public class GetRoleByIdQuery : IRequest<Result<RoleDto>>
    {
        public Guid RoleId { get; set; }
    }
}