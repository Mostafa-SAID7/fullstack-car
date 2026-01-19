using Application.Common.Patterns;
using Application.Features.Community.QA.Services;
using MediatR;

namespace Application.Features.Community.QA.Queries;

/// <summary>
/// Query to get experts by category
/// </summary>
public class GetExpertsByCategoryQuery : IRequest<Result<List<Guid>>>
{
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// Query to get ranked experts in a category
/// </summary>
public class GetRankedExpertsQuery : IRequest<Result<List<ExpertRankingDto>>>
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; } = 10;
}

/// <summary>
/// Query to check if user is expert in category
/// </summary>
public class IsUserExpertInCategoryQuery : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// Query to determine user's expertise level in category
/// </summary>
public class DetermineExpertiseLevelQuery : IRequest<Result<string>>
{
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// Query to get notifiable experts for a category
/// </summary>
public class GetNotifiableExpertsQuery : IRequest<Result<List<Guid>>>
{
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// Query to get expert notification preferences
/// </summary>
public class GetExpertNotificationPreferencesQuery : IRequest<Result<Dictionary<string, bool>>>
{
    public Guid UserId { get; set; }
}

/// <summary>
/// Query to get expert badges for a user
/// </summary>
public class GetExpertBadgesQuery : IRequest<Result<List<string>>>
{
    public Guid UserId { get; set; }
}

/// <summary>
/// Query to check if user has expert badge in category
/// </summary>
public class HasExpertBadgeQuery : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// Query to get user's expertise categories
/// </summary>
public class GetUserExpertiseCategoriesQuery : IRequest<Result<List<string>>>
{
    public Guid UserId { get; set; }
}

/// <summary>
/// Query to get expert preferences
/// </summary>
public class GetExpertPreferencesQuery : IRequest<Result<ExpertPreferencesDto>>
{
    public Guid UserId { get; set; }
}

/// <summary>
/// Query to get expert analytics
/// </summary>
public class GetExpertAnalyticsQuery : IRequest<Result<ExpertAnalyticsDto>>
{
    public Guid UserId { get; set; }
    public string? Category { get; set; }
}

/// <summary>
/// Query to get expert leaderboard
/// </summary>
public class GetExpertLeaderboardQuery : IRequest<Result<List<ExpertLeaderboardDto>>>
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; } = 10;
}

/// <summary>
/// Query to get expert performance metrics
/// </summary>
public class GetExpertPerformanceQuery : IRequest<Result<ExpertPerformanceDto>>
{
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
}