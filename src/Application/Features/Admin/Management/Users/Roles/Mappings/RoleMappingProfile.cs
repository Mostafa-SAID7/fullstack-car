using AutoMapper;
using Application.Features.Admin.Management.Users.Roles.DTOs.Responses;
using Domain.Entities.Identity;

namespace Application.Features.Admin.Management.Users.Roles.Mappings
{
    public class RoleMappingProfile : AutoMapper.Profile
    {
        public RoleMappingProfile()
        {
            CreateMap<ApplicationRole, RoleResponse>()
                .ForMember(dest => dest.UserCount, opt => opt.Ignore()) // Will be calculated separately
                .ForMember(dest => dest.Permissions, opt => opt.Ignore()) // Will be mapped from RoleClaims
                .ForMember(dest => dest.IsSystemRole, opt => opt.Ignore()); // Will be determined by business logic
        }
    }
}