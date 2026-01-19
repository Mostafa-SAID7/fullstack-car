using Application.Features.Community.DTOs.Responses;
using AutoMapper;
using Domain.Entities.Community;

namespace Application.Features.Community.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Question mappings
        CreateMap<Question, QuestionDto>()
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => SplitTags(src.Tags)))
            .ForMember(dest => dest.UserName, opt => opt.Ignore())
            .ForMember(dest => dest.UserReputation, opt => opt.Ignore())
            .ForMember(dest => dest.UserVote, opt => opt.Ignore());

        CreateMap<Question, QuestionListDto>()
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => SplitTags(src.Tags)))
            .ForMember(dest => dest.HasAcceptedAnswer, opt => opt.MapFrom(src => src.AcceptedAnswerId != null))
            .ForMember(dest => dest.UserName, opt => opt.Ignore())
            .ForMember(dest => dest.UserReputation, opt => opt.Ignore())
            .ForMember(dest => dest.LastActivityAt, opt => opt.MapFrom(src => src.UpdatedAt ?? src.CreatedAt));

        // Answer mappings
        CreateMap<Answer, AnswerDto>()
            .ForMember(dest => dest.UserName, opt => opt.Ignore())
            .ForMember(dest => dest.UserReputation, opt => opt.Ignore())
            .ForMember(dest => dest.UserVote, opt => opt.Ignore())
            .ForMember(dest => dest.IsEdited, opt => opt.MapFrom(src => src.UpdatedAt.HasValue))
            .ForMember(dest => dest.VersionHistory, opt => opt.Ignore());

        // Reputation mappings
        CreateMap<UserReputation, UserReputationDto>()
            .ForMember(dest => dest.UserName, opt => opt.Ignore())
            .ForMember(dest => dest.Email, opt => opt.Ignore())
            .ForMember(dest => dest.BadgesEarned, opt => opt.MapFrom(src => DeserializeBadges(src.BadgesEarned)))
            .ForMember(dest => dest.ExpertiseAreas, opt => opt.MapFrom(src => DeserializeExpertiseAreas(src.ExpertiseAreas)))
            .ForMember(dest => dest.Rank, opt => opt.Ignore());

        // Category mappings
        CreateMap<QuestionCategory, CategoryDto>();

        // Tag mappings
        CreateMap<Tag, TagDto>()
            .ForMember(dest => dest.Category, opt => opt.Ignore());

        // Expert mappings
        CreateMap<Expert, ExpertDto>()
            .ForMember(dest => dest.UserName, opt => opt.Ignore())
            .ForMember(dest => dest.Category, opt => opt.Ignore())
            .ForMember(dest => dest.ReputationScore, opt => opt.Ignore())
            .ForMember(dest => dest.BadgesEarned, opt => opt.Ignore());
    }

    private static List<string> SplitTags(string? tags)
    {
        if (string.IsNullOrEmpty(tags))
            return new List<string>();
        
        return tags.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList();
    }

    private static List<string> DeserializeBadges(string? badgesJson)
    {
        if (string.IsNullOrEmpty(badgesJson))
            return new List<string>();
        
        try
        {
            return System.Text.Json.JsonSerializer.Deserialize<List<string>>(badgesJson) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }

    private static List<string> DeserializeExpertiseAreas(string? expertiseJson)
    {
        if (string.IsNullOrEmpty(expertiseJson))
            return new List<string>();
        
        try
        {
            return System.Text.Json.JsonSerializer.Deserialize<List<string>>(expertiseJson) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }
}
