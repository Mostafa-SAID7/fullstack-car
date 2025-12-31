using AutoMapper;
using Application.Features.Identity.Auth.DTOs.Requests;
using Application.Features.Identity.Auth.DTOs.Responses;
using Domain.Entities.Identity;

namespace Application.Features.Identity.Auth.Mappings
{
    public class AuthMappingProfile : AutoMapper.Profile
    {
        public AuthMappingProfile()
        {
            CreateMap<ApplicationUser, AuthResponse>()
                .ForMember(dest => dest.Token, opt => opt.Ignore())
                .ForMember(dest => dest.RefreshToken, opt => opt.Ignore())
                .ForMember(dest => dest.ExpiresAt, opt => opt.Ignore());

            CreateMap<RegisterRequest, ApplicationUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
        }
    }
}