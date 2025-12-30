using Application.Features.Identity.Security.DTOs.Requests;
using Application.Features.Identity.Security.DTOs.Responses;
using AutoMapper;
using Domain.Entities.Identity;

namespace Application.Common.Mappings.Identity.Security
{
    public class SecurityMappingProfile : Profile
    {
        public SecurityMappingProfile()
        {
            // User Session Mapping
            CreateMap<UserSession, SessionResponse>()
                .ForMember(dest => dest.SessionId, opt => opt.MapFrom(src => src.SessionId))
                .ForMember(dest => dest.DeviceInfo, opt => opt.MapFrom(src => src.DeviceInfo))
                .ForMember(dest => dest.IpAddress, opt => opt.MapFrom(src => src.IpAddress))
                .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location))
                .ForMember(dest => dest.LastActivity, opt => opt.MapFrom(src => src.LastActivity))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

            // Security Log Response
            CreateMap<UserSession, SecurityLogResponse>()
                .ForMember(dest => dest.Action, opt => opt.MapFrom(src => "Session Activity"))
                .ForMember(dest => dest.IpAddress, opt => opt.MapFrom(src => src.IpAddress))
                .ForMember(dest => dest.UserAgent, opt => opt.MapFrom(src => src.UserAgent))
                .ForMember(dest => dest.Timestamp, opt => opt.MapFrom(src => src.LastActivity))
                .ForMember(dest => dest.Details, opt => opt.MapFrom(src => $"Device: {src.DeviceInfo}, Location: {src.Location}"));

            // Two Factor Status Response
            CreateMap<ApplicationUser, TwoFactorStatusResponse>()
                .ForMember(dest => dest.IsEnabled, opt => opt.MapFrom(src => src.TwoFactorEnabled))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id.ToString()));
        }
    }
}