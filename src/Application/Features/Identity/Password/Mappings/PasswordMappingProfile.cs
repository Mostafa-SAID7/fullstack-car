using Application.Features.Identity.Password.DTOs.Requests;
using Application.Features.Identity.Password.DTOs.Responses;
using AutoMapper;
using Domain.Entities.Identity;

namespace Application.Features.Identity.Password.Mappings
{
    public class PasswordMappingProfile : AutoMapper.Profile
    {
        public PasswordMappingProfile()
        {
            // Password Strength Result - no mapping needed as it's created directly
            
            // Basic user info for password operations
            CreateMap<ApplicationUser, object>()
                .ForMember(dest => dest, opt => opt.MapFrom(src => new 
                { 
                    UserId = src.Id.ToString(),
                    Email = src.Email,
                    FullName = $"{src.FirstName} {src.LastName}"
                }));
        }
    }
}
