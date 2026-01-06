using AutoMapper;
using Application.Features.Community.Friends.DTOs;
using Domain.Entities.Community.Social;
using Domain.Entities.Identity;

namespace Application.Features.Community.Friends.Mappings
{
    public class FriendMappingProfile : AutoMapper.Profile
    {
        public FriendMappingProfile()
        {
            CreateMap<ApplicationUser, FriendDto>()
                .ForMember(dest => dest.FriendsSince, opt => opt.Ignore()); // This will be set from UserFriend entity

            CreateMap<UserFriend, FriendRequestDto>()
                .ForMember(dest => dest.id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.RequesterId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.RequesterFirstName, opt => opt.MapFrom(src => src.User.FirstName))
                .ForMember(dest => dest.RequesterLastName, opt => opt.MapFrom(src => src.User.LastName))
                .ForMember(dest => dest.RequesterProfileImageUrl, opt => opt.MapFrom(src => src.User.ProfileImageUrl))
                .ForMember(dest => dest.RequestedAt, opt => opt.MapFrom(src => src.CreatedAt));
        }
    }
}
