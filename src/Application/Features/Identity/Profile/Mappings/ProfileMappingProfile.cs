using AutoMapper;
using Application.Features.Identity.Profile.DTOs.Requests;
using Application.Features.Identity.Profile.DTOs.Responses;
using Domain.Entities.Identity;

namespace Application.Features.Identity.Profile.Mappings
{
    public class ProfileMappingProfile : AutoMapper.Profile
    {
        public ProfileMappingProfile()
        {
            CreateMap<ApplicationUser, UserProfileResponse>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}".Trim()));

            CreateMap<UpdateProfileRequest, ApplicationUser>();

            CreateMap<ApplicationUser, UserPrivacySettings>();
        }
    }
}
