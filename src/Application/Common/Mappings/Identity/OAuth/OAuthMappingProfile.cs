using Application.Features.Identity.OAuth.DTOs.Requests;
using Application.Features.Identity.OAuth.DTOs.Responses;
using AutoMapper;
using Domain.Entities.Identity;

namespace Application.Common.Mappings.Identity.OAuth
{
    public class OAuthMappingProfile : Profile
    {
        public OAuthMappingProfile()
        {
            // OAuth User Registration
            CreateMap<OAuthRegisterRequest, ApplicationUser>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.NormalizedUserName, opt => opt.MapFrom(src => src.Email.ToUpper()))
                .ForMember(dest => dest.NormalizedEmail, opt => opt.MapFrom(src => src.Email.ToUpper()))
                .ForMember(dest => dest.EmailConfirmed, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Domain.Enums.UserStatus.Active));

            // OAuth Response
            CreateMap<ApplicationUser, OAuthResponse>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));
        }
    }
}