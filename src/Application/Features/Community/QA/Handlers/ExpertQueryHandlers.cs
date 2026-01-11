using Application.Common.Patterns;
using Application.Features.Community.QA.Queries;
using Application.Features.Community.QA.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Features.Community.QA.Handlers;

/// <summary>
/// Handler for getting experts by category
/// </summary>
public class GetExpertsByCategoryQueryHandler : IRequestHandler<GetExpertsByCategoryQuery, Result<List<Guid>>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<GetExpertsByCategoryQueryHandler> _logger;

    public GetExpertsByCategoryQueryHandler(
        IExpertService expertService,
        ILogger<GetExpertsByCategoryQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<List<Guid>>> Handle(GetExpertsByCategoryQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var experts = await _expertService.GetExpertsByCategoryAsync(request.Category);
            return Result<List<Guid>>.Success(experts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting experts for category {Category}", request.Category);
            return Result<List<Guid>>.Failure($"Failed to get experts: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for getting ranked experts
/// </summary>
public class GetRankedExpertsQueryHandler : IRequestHandler<GetRankedExpertsQuery, Result<List<ExpertRankingDto>>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<GetRankedExpertsQueryHandler> _logger;

    public GetRankedExpertsQueryHandler(
        IExpertService expertService,
        ILogger<GetRankedExpertsQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<List<ExpertRankingDto>>> Handle(GetRankedExpertsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var rankedExperts = await _expertService.GetRankedExpertsAsync(request.Category, request.Count);
            return Result<List<ExpertRankingDto>>.Success(rankedExperts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting ranked experts for category {Category}", request.Category);
            return Result<List<ExpertRankingDto>>.Failure($"Failed to get ranked experts: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for checking if user is expert in category
/// </summary>
public class IsUserExpertInCategoryQueryHandler : IRequestHandler<IsUserExpertInCategoryQuery, Result<bool>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<IsUserExpertInCategoryQueryHandler> _logger;

    public IsUserExpertInCategoryQueryHandler(
        IExpertService expertService,
        ILogger<IsUserExpertInCategoryQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(IsUserExpertInCategoryQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var isExpert = await _expertService.IsUserExpertInCategoryAsync(request.UserId, request.Category);
            return Result<bool>.Success(isExpert);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if user {UserId} is expert in category {Category}", 
                request.UserId, request.Category);
            return Result<bool>.Failure($"Failed to check expert status: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for determining expertise level
/// </summary>
public class DetermineExpertiseLevelQueryHandler : IRequestHandler<DetermineExpertiseLevelQuery, Result<string>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<DetermineExpertiseLevelQueryHandler> _logger;

    public DetermineExpertiseLevelQueryHandler(
        IExpertService expertService,
        ILogger<DetermineExpertiseLevelQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<string>> Handle(DetermineExpertiseLevelQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var expertiseLevel = await _expertService.DetermineExpertiseLevelAsync(request.UserId, request.Category);
            return Result<string>.Success(expertiseLevel);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error determining expertise level for user {UserId} in category {Category}", 
                request.UserId, request.Category);
            return Result<string>.Failure($"Failed to determine expertise level: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for getting notifiable experts
/// </summary>
public class GetNotifiableExpertsQueryHandler : IRequestHandler<GetNotifiableExpertsQuery, Result<List<Guid>>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<GetNotifiableExpertsQueryHandler> _logger;

    public GetNotifiableExpertsQueryHandler(
        IExpertService expertService,
        ILogger<GetNotifiableExpertsQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<List<Guid>>> Handle(GetNotifiableExpertsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var experts = await _expertService.GetNotifiableExpertsAsync(request.Category);
            return Result<List<Guid>>.Success(experts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notifiable experts for category {Category}", request.Category);
            return Result<List<Guid>>.Failure($"Failed to get notifiable experts: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for getting expert notification preferences
/// </summary>
public class GetExpertNotificationPreferencesQueryHandler : IRequestHandler<GetExpertNotificationPreferencesQuery, Result<Dictionary<string, bool>>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<GetExpertNotificationPreferencesQueryHandler> _logger;

    public GetExpertNotificationPreferencesQueryHandler(
        IExpertService expertService,
        ILogger<GetExpertNotificationPreferencesQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<Dictionary<string, bool>>> Handle(GetExpertNotificationPreferencesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var preferences = await _expertService.GetExpertNotificationPreferencesAsync(request.UserId);
            return Result<Dictionary<string, bool>>.Success(preferences);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notification preferences for user {UserId}", request.UserId);
            return Result<Dictionary<string, bool>>.Failure($"Failed to get notification preferences: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for getting expert badges
/// </summary>
public class GetExpertBadgesQueryHandler : IRequestHandler<GetExpertBadgesQuery, Result<List<string>>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<GetExpertBadgesQueryHandler> _logger;

    public GetExpertBadgesQueryHandler(
        IExpertService expertService,
        ILogger<GetExpertBadgesQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<List<string>>> Handle(GetExpertBadgesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var badges = await _expertService.GetExpertBadgesAsync(request.UserId);
            return Result<List<string>>.Success(badges);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert badges for user {UserId}", request.UserId);
            return Result<List<string>>.Failure($"Failed to get expert badges: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for checking expert badge
/// </summary>
public class HasExpertBadgeQueryHandler : IRequestHandler<HasExpertBadgeQuery, Result<bool>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<HasExpertBadgeQueryHandler> _logger;

    public HasExpertBadgeQueryHandler(
        IExpertService expertService,
        ILogger<HasExpertBadgeQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(HasExpertBadgeQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var hasBadge = await _expertService.HasExpertBadgeAsync(request.UserId, request.Category);
            return Result<bool>.Success(hasBadge);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking expert badge for user {UserId} in category {Category}", 
                request.UserId, request.Category);
            return Result<bool>.Failure($"Failed to check expert badge: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for getting user expertise categories
/// </summary>
public class GetUserExpertiseCategoriesQueryHandler : IRequestHandler<GetUserExpertiseCategoriesQuery, Result<List<string>>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<GetUserExpertiseCategoriesQueryHandler> _logger;

    public GetUserExpertiseCategoriesQueryHandler(
        IExpertService expertService,
        ILogger<GetUserExpertiseCategoriesQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<List<string>>> Handle(GetUserExpertiseCategoriesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var categories = await _expertService.GetUserExpertiseCategoriesAsync(request.UserId);
            return Result<List<string>>.Success(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expertise categories for user {UserId}", request.UserId);
            return Result<List<string>>.Failure($"Failed to get expertise categories: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for getting expert preferences
/// </summary>
public class GetExpertPreferencesQueryHandler : IRequestHandler<GetExpertPreferencesQuery, Result<ExpertPreferencesDto>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<GetExpertPreferencesQueryHandler> _logger;

    public GetExpertPreferencesQueryHandler(
        IExpertService expertService,
        ILogger<GetExpertPreferencesQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<ExpertPreferencesDto>> Handle(GetExpertPreferencesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var preferences = await _expertService.GetExpertPreferencesAsync(request.UserId);
            return Result<ExpertPreferencesDto>.Success(preferences);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert preferences for user {UserId}", request.UserId);
            return Result<ExpertPreferencesDto>.Failure($"Failed to get expert preferences: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for getting expert analytics
/// </summary>
public class GetExpertAnalyticsQueryHandler : IRequestHandler<GetExpertAnalyticsQuery, Result<ExpertAnalyticsDto>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<GetExpertAnalyticsQueryHandler> _logger;

    public GetExpertAnalyticsQueryHandler(
        IExpertService expertService,
        ILogger<GetExpertAnalyticsQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<ExpertAnalyticsDto>> Handle(GetExpertAnalyticsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var analytics = await _expertService.GetExpertAnalyticsAsync(request.UserId, request.Category);
            return Result<ExpertAnalyticsDto>.Success(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert analytics for user {UserId}", request.UserId);
            return Result<ExpertAnalyticsDto>.Failure($"Failed to get expert analytics: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for getting expert leaderboard
/// </summary>
public class GetExpertLeaderboardQueryHandler : IRequestHandler<GetExpertLeaderboardQuery, Result<List<ExpertLeaderboardDto>>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<GetExpertLeaderboardQueryHandler> _logger;

    public GetExpertLeaderboardQueryHandler(
        IExpertService expertService,
        ILogger<GetExpertLeaderboardQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<List<ExpertLeaderboardDto>>> Handle(GetExpertLeaderboardQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var leaderboard = await _expertService.GetExpertLeaderboardAsync(request.Category, request.Count);
            return Result<List<ExpertLeaderboardDto>>.Success(leaderboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert leaderboard for category {Category}", request.Category);
            return Result<List<ExpertLeaderboardDto>>.Failure($"Failed to get expert leaderboard: {ex.Message}");
        }
    }
}

/// <summary>
/// Handler for getting expert performance
/// </summary>
public class GetExpertPerformanceQueryHandler : IRequestHandler<GetExpertPerformanceQuery, Result<ExpertPerformanceDto>>
{
    private readonly IExpertService _expertService;
    private readonly ILogger<GetExpertPerformanceQueryHandler> _logger;

    public GetExpertPerformanceQueryHandler(
        IExpertService expertService,
        ILogger<GetExpertPerformanceQueryHandler> logger)
    {
        _expertService = expertService;
        _logger = logger;
    }

    public async Task<Result<ExpertPerformanceDto>> Handle(GetExpertPerformanceQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var performance = await _expertService.GetExpertPerformanceAsync(request.UserId, request.Category);
            return Result<ExpertPerformanceDto>.Success(performance);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert performance for user {UserId} in category {Category}", 
                request.UserId, request.Category);
            return Result<ExpertPerformanceDto>.Failure($"Failed to get expert performance: {ex.Message}");
        }
    }
}