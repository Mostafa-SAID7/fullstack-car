using Application.Features.Identity.Password.DTOs.Requests;
using Application.Features.Identity.Password.DTOs.Responses;
using AutoMapper;
using Domain.Entities.Identity;

namespace Application.Common.Mappings.Identity.Password
{
    public class PasswordMappingProfile : Profile
    {
        public PasswordMappingProfile()
        {
            // Password Reset Token Response
            CreateMap<ApplicationUser, PasswordResetTokenResponse>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));

            // Password Change Response
            CreateMap<ApplicationUser, PasswordChangeResponse>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id.ToString()))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.LastPasswordChange, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}