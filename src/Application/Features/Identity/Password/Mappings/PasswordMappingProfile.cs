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
            
            // Basic user info for password operations - removed invalid mapping
            // CreateMap<ApplicationUser, object>() is not valid AutoMapper syntax
            // If needed, create specific DTOs and map to those instead
        }
    }
}
