using Application.Features.Community.Guides.DTOs.Responses;
using AutoMapper;
using Domain.Entities.Community.Guides;

namespace Application.Features.Community.Guides.Mappings;

public class GuideMappingProfile : Profile
{
    public GuideMappingProfile()
    {
        CreateMap<Guide, GuideDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.ToString()))
            .ForMember(dest => dest.DifficultyName, opt => opt.MapFrom(src => src.Difficulty.ToString()))
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => DeserializeTags(src.Tags)))
            .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author != null ? src.Author.UserName : "Unknown"))
            .ForMember(dest => dest.AuthorAvatar, opt => opt.MapFrom(src => src.Author != null ? src.Author.ProfileImageUrl : null))
            .ForMember(dest => dest.Steps, opt => opt.MapFrom(src => src.Steps.OrderBy(s => s.StepNumber)))
            .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src => src.Ratings.Any() ? src.Ratings.Average(r => r.Rating) : 0))
            .ForMember(dest => dest.RatingCount, opt => opt.MapFrom(src => src.Ratings.Count))
            .ForMember(dest => dest.IsBookmarked, opt => opt.Ignore())
            .ForMember(dest => dest.UserRating, opt => opt.Ignore());

        CreateMap<Guide, GuideListDto>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.ToString()))
            .ForMember(dest => dest.DifficultyName, opt => opt.MapFrom(src => src.Difficulty.ToString()))
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => DeserializeTags(src.Tags)))
            .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author != null ? src.Author.UserName : "Unknown"))
            .ForMember(dest => dest.AuthorAvatar, opt => opt.MapFrom(src => src.Author != null ? src.Author.ProfileImageUrl : null))
            .ForMember(dest => dest.AverageRating, opt => opt.MapFrom(src => src.Ratings.Any() ? src.Ratings.Average(r => r.Rating) : 0))
            .ForMember(dest => dest.RatingCount, opt => opt.MapFrom(src => src.Ratings.Count))
            .ForMember(dest => dest.IsBookmarked, opt => opt.Ignore());

        CreateMap<GuideStep, GuideStepDto>();
    }

    private static List<string> DeserializeTags(string? tags)
    {
        if (string.IsNullOrEmpty(tags))
            return new List<string>();
        
        try
        {
            return System.Text.Json.JsonSerializer.Deserialize<List<string>>(tags) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }
}