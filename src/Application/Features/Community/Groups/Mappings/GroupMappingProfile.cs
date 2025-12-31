using AutoMapper;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;

namespace Application.Features.Community.Groups.Mappings
{
    public class GroupMappingProfile : AutoMapper.Profile
    {
        public GroupMappingProfile()
        {
            CreateMap<Group, GroupDto>()
                .ForMember(dest => dest.OwnerId, opt => opt.MapFrom(src => src.Owner.Id))
                .ForMember(dest => dest.OwnerFirstName, opt => opt.MapFrom(src => src.Owner.FirstName))
                .ForMember(dest => dest.OwnerLastName, opt => opt.MapFrom(src => src.Owner.LastName))
                .ForMember(dest => dest.OwnerProfileImageUrl, opt => opt.MapFrom(src => src.Owner.ProfileImageUrl));

            CreateMap<GroupMember, GroupMemberDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.UserFirstName, opt => opt.MapFrom(src => src.User.FirstName))
                .ForMember(dest => dest.UserLastName, opt => opt.MapFrom(src => src.User.LastName))
                .ForMember(dest => dest.UserProfileImageUrl, opt => opt.MapFrom(src => src.User.ProfileImageUrl));

            CreateMap<CreateGroupRequest, Group>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Owner, opt => opt.Ignore())
                .ForMember(dest => dest.Members, opt => opt.Ignore())
                .ForMember(dest => dest.Posts, opt => opt.Ignore());

            CreateMap<UpdateGroupRequest, Group>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Owner, opt => opt.Ignore())
                .ForMember(dest => dest.Members, opt => opt.Ignore())
                .ForMember(dest => dest.Posts, opt => opt.Ignore());
        }
    }
}