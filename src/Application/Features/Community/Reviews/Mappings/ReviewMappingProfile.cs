using AutoMapper;
using Application.Features.Community.Reviews.DTOs;
using Domain.Entities.Community.Reviews;

namespace Application.Features.Community.Reviews.Mappings
{
    public class ReviewMappingProfile : AutoMapper.Profile
    {
        public ReviewMappingProfile()
        {
            CreateMap<Review, ReviewDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.UserFirstName, opt => opt.MapFrom(src => src.User.FirstName))
                .ForMember(dest => dest.UserLastName, opt => opt.MapFrom(src => src.User.LastName))
                .ForMember(dest => dest.UserProfileImageUrl, opt => opt.MapFrom(src => src.User.ProfileImageUrl));

            CreateMap<CreateReviewRequest, Review>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.IsVerified, opt => opt.Ignore())
                .ForMember(dest => dest.HelpfulCount, opt => opt.Ignore());

            CreateMap<UpdateReviewRequest, Review>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Type, opt => opt.Ignore())
                .ForMember(dest => dest.CarBrand, opt => opt.Ignore())
                .ForMember(dest => dest.CarModel, opt => opt.Ignore())
                .ForMember(dest => dest.CarYear, opt => opt.Ignore())
                .ForMember(dest => dest.IsVerified, opt => opt.Ignore())
                .ForMember(dest => dest.HelpfulCount, opt => opt.Ignore());
        }
    }
}