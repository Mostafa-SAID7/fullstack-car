using Application.Features.Identity.Security.DTOs.Requests;
using Application.Features.Identity.Security.DTOs.Responses;
using AutoMapper;
using Domain.Entities.Identity;

namespace Application.Common.Mappings.Identity.Security
{
    public class SecurityMappingProfile : AutoMapper.Profile
    {
        public SecurityMappingProfile()
        {
            // User Session Mapping
            CreateMap<UserSession, UserSessionResponse>()
                .ForMember(dest => dest.SessionId, opt => opt.MapFrom(src => src.SessionId))
                .ForMember(dest => dest.DeviceInfo, opt => opt.MapFrom(src => src.DeviceInfo))
                .ForMember(dest => dest.IpAddress, opt => opt.MapFrom(src => src.IpAddress))
                .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location))
                .ForMember(dest => dest.LastActivity, opt => opt.MapFrom(src => src.LastActivity))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.ExpiresAt, opt => opt.MapFrom(src => src.ExpiresAt))
                .ForMember(dest => dest.IsCurrentSession, opt => opt.MapFrom(src => false));

            // Security Log Response
            CreateMap<UserSession, SecurityLogResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.EventType, opt => opt.MapFrom(src => "Session Activity"))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => "User session activity"))
                .ForMember(dest => dest.IpAddress, opt => opt.MapFrom(src => src.IpAddress))
                .ForMember(dest => dest.UserAgent, opt => opt.MapFrom(src => src.UserAgent))
                .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(src => src.LastActivity))
                .ForMember(dest => dest.IsSuccessful, opt => opt.MapFrom(src => true))
                .ForMember(
                    dest => dest.AdditionalData,
                    opt => opt.MapFrom(src => $"Device: {src.DeviceInfo}, Location: {src.Location}"));

            // Two Factor Setup Response
            CreateMap<ApplicationUser, TwoFactorSetupResponse>()
                .ForMember(dest => dest.SharedKey, opt => opt.Ignore())
                .ForMember(dest => dest.AuthenticatorUri, opt => opt.Ignore())
                .ForMember(dest => dest.QrCodeUri, opt => opt.Ignore())
                .ForMember(dest => dest.RecoveryCodes, opt => opt.Ignore());
        }
    }
}