using Application.Features.Media.Videos.DTOs.Responses;
using AutoMapper;
using Domain.Entities.Media;

namespace Application.Features.Media.Videos.Mappings;

public class VideoMappingProfile : Profile
{
    public VideoMappingProfile()
    {
        CreateMap<Video, VideoDto>();
        CreateMap<Video, VideoListDto>();
        CreateMap<Video, VideoDetailsDto>();
        CreateMap<VideoComment, VideoCommentDto>();
    }
}