using Application.Common.Models;
using Application.Features.Media.Discovery.DTOs;
using Domain.Enums.Media;
using MediatR;

namespace Application.Features.Media.Discovery.Queries;

public class GetFeaturedContentQuery : IRequest<Result<FeaturedContentDto>>
{
    public MediaType? MediaType { get; set; }
    public int VideoCount { get; set; } = 5;
    public int PodcastCount { get; set; } = 5;
    public string? Category { get; set; }
    public bool IncludeHeroContent { get; set; } = true;
}