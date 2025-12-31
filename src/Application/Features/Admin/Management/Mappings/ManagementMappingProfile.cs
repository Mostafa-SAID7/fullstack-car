using AutoMapper;
using Application.Features.Admin.Management.DTOs.Responses;
using Domain.Entities.Identity;

namespace Application.Features.Admin.Management.Mappings
{
    public class ManagementMappingProfile : AutoMapper.Profile
    {
        public ManagementMappingProfile()
        {
            CreateMap<ApplicationUser, AdminUserResponse>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.JoinDate, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.PostsCount, opt => opt.Ignore()) // Will be calculated separately
                .ForMember(dest => dest.GroupsCount, opt => opt.Ignore()) // Will be calculated separately
                .ForMember(dest => dest.ReviewsCount, opt => opt.Ignore()) // Will be calculated separately
                .ForMember(dest => dest.Roles, opt => opt.Ignore()) // Will be mapped from UserRoles
                .ForMember(dest => dest.UserStatus, opt => opt.MapFrom(src => src.Status));

            CreateMap<ApplicationRole, RoleResponse>()
                .ForMember(dest => dest.UserCount, opt => opt.Ignore()) // Will be calculated separately
                .ForMember(dest => dest.Permissions, opt => opt.Ignore()) // Will be mapped from RoleClaims
                .ForMember(dest => dest.IsSystemRole, opt => opt.Ignore()); // Will be determined by business logic
        }
    }
}