using MediatR;
using Application.Common.Models;
using Application.Features.Media.Podcasts.DTOs.Responses;

namespace Application.Features.Media.Podcasts.Queries;

public class GetFeaturedPodcastsQuery : IRequest<Result<List<PodcastResponse>>>
{
    public int Count { get; set; } = 10;
}

public class GetPodcastAnalyticsQuery : IRequest<Result<PodcastAnalyticsResponse>>
{
    public int PodcastId { get; set; }
}

public class GetPodcastCategoriesQuery : IRequest<Result<List<PodcastCategoryResponse>>>
{
}

public class GetPodcastDashboardQuery : IRequest<Result<PodcastDashboardResponse>>
{
}