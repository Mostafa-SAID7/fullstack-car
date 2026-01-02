using Application.Features.Media.Podcasts.DTOs.Responses;
using AutoMapper;
using Domain.Entities.Media;

namespace Application.Features.Media.Podcasts.Mappings;

public class PodcastMappingProfile : Profile
{
    public PodcastMappingProfile()
    {
        CreateMap<Podcast, PodcastDto>();
        CreateMap<Podcast, PodcastListDto>();
        CreateMap<Podcast, PodcastDetailsDto>();
        CreateMap<PodcastSeries, PodcastSeriesDto>()
            .ForMember(dest => dest.EpisodeCount, opt => opt.MapFrom(src => src.Episodes.Count));
        CreateMap<PodcastComment, PodcastCommentDto>();
    }
}