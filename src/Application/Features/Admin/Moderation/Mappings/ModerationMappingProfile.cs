using AutoMapper;
using Application.Features.Admin.Moderation.DTOs;
using Domain.Entities.Community.Posts;

namespace Application.Features.Admin.Moderation.Mappings
{
    public class ModerationMappingProfile : AutoMapper.Profile
    {
        public ModerationMappingProfile()
        {
            CreateMap<PostReport, ContentReportDto>()
                .ForMember(dest => dest.ContentId, opt => opt.MapFrom(src => src.PostId))
                .ForMember(dest => dest.ContentType, opt => opt.MapFrom(src => "Post"))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Post.Title))
                .ForMember(dest => dest.ReporterId, opt => opt.MapFrom(src => src.ReportedBy))
                .ForMember(dest => dest.ReporterName, opt => opt.MapFrom(src => $"{src.Reporter.FirstName} {src.Reporter.LastName}"))
                .ForMember(dest => dest.ReporterEmail, opt => opt.MapFrom(src => src.Reporter.Email))
                .ForMember(dest => dest.ResolvedByName, opt => opt.MapFrom(src => src.Resolver != null ? $"{src.Resolver.FirstName} {src.Resolver.LastName}" : null))
                .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => "Normal"));

            CreateMap<Post, ContentModerationDto>()
                .ForMember(dest => dest.ContentType, opt => opt.MapFrom(src => "Post"))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.AuthorEmail, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.AuthorId, opt => opt.MapFrom(src => src.User.Id))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.ReportCount, opt => opt.MapFrom(src => src.Reports.Count))
                .ForMember(dest => dest.Reports, opt => opt.MapFrom(src => src.Reports))
                .ForMember(dest => dest.LastModeration, opt => opt.Ignore()); // Will be mapped separately
        }
    }
}
