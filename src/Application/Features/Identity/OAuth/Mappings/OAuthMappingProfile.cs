using Application.Features.Identity.OAuth.DTOs.Requests;
using Application.Features.Identity.OAuth.DTOs.Responses;
using AutoMapper;
using Domain.Entities.Identity;
using Domain.Enums.Identity;

namespace Application.Features.Identity.OAuth.Mappings
{
    public class OAuthMappingProfile : AutoMapper.Profile
    {
        public OAuthMappingProfile()
        {
            // External Login Info Response
            CreateMap<ApplicationUser, Application.Features.Identity.OAuth.DTOs.Responses.ExternalLoginInfo>()
                .ForMember(dest => dest.Provider, opt => opt.MapFrom(src => src.ExternalProvider ?? ""))
                .ForMember(dest => dest.ProviderKey, opt => opt.MapFrom(src => src.ExternalProviderId ?? ""))
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.LinkedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive));
        }
    }
}