using Application.Features.Admin.Management.Users.Users.DTOs.Responses;
using Application.Features.Admin.Management.Users.Users.Models;
using AutoMapper;
using Domain.Entities.Identity;

namespace Application.Features.Admin.Management.Users.Users.Mappings
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<ApplicationUser, AdminUser>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.JoinDate, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles.Select(ur => ur.Role.Name).ToList()));

            CreateMap<ApplicationUser, UserSummary>()
                .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles.Select(ur => ur.Role.Name).ToList()));

            CreateMap<AdminUser, UserDetailResponse>();
        }
    }
}
