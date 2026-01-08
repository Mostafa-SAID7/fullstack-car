using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Discovery.Queries;

public class GetRecommendationsQuery : IRequest<Result<RecommendationsDto>>
{
    public Guid? UserId { get; set; }
    public MediaType? MediaType { get; set; }
    public int VideoCount { get; set; } = 10;
    public int PodcastCount { get; set; } = 10;
    public bool IncludeWatchHistory { get; set; } = true;
    public bool IncludeLikedContent { get; set; } = true;
    public bool IncludeFollowedCreators { get; set; } = true;
}