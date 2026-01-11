using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Extensions;
using Application.Features.Community.QA.Queries;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Community.QA.Handlers;

public class GetUserReputationHandler : IRequestHandler<GetUserReputationQuery, Result<UserReputationDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<GetUserReputationHandler> _logger;

    public GetUserReputationHandler(
        IApplicationDbContext context,
        ILogger<GetUserReputationHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<UserReputationDto>> Handle(GetUserReputationQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var userReputation = await _context.UserReputations
                .Include(ur => ur.User)
                .FirstOrDefaultAsync(ur => ur.UserId == request.UserId, cancellationToken);

            if (userReputation == null)
            {
                // Create default reputation record if it doesn't exist
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

                if (user == null)
                {
                    return Result<UserReputationDto>.Failure(new[] { "User not found" });
                }

                var defaultReputation = new UserReputationDto
                {
                    UserId = request.UserId,
                    UserName = user.UserName ?? "Unknown",
                    Email = user.Email ?? "Unknown",
                    ReputationScore = 0,
                    QuestionsAsked = 0,
                    AnswersGiven = 0,
                    AcceptedAnswers = 0,
                    UpvotesReceived = 0,
                    DownvotesReceived = 0,
                    BadgesEarned = new List<string>(),
                    ExpertiseAreas = new List<string>(),
                    LastUpdated = DateTime.UtcNow,
                    Rank = await GetUserRank(0, cancellationToken)
                };

                return Result<UserReputationDto>.Success(defaultReputation);
            }

            var result = new UserReputationDto
            {
                UserId = userReputation.UserId,
                UserName = userReputation.User?.UserName ?? "Unknown",
                Email = userReputation.User?.Email ?? "Unknown",
                ReputationScore = userReputation.ReputationScore,
                QuestionsAsked = userReputation.QuestionsAsked,
                AnswersGiven = userReputation.AnswersGiven,
                AcceptedAnswers = userReputation.AcceptedAnswers,
                UpvotesReceived = userReputation.UpvotesReceived,
                DownvotesReceived = userReputation.DownvotesReceived,
                BadgesEarned = userReputation.BadgesEarned?.DeserializeStringList() ?? new List<string>(),
                ExpertiseAreas = userReputation.ExpertiseAreas?.DeserializeStringList() ?? new List<string>(),
                LastUpdated = userReputation.LastUpdated,
                Rank = await GetUserRank(userReputation.ReputationScore, cancellationToken)
            };

            return Result<UserReputationDto>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving reputation for user {UserId}", request.UserId);
            return Result<UserReputationDto>.Failure(new[] { "Failed to retrieve user reputation" });
        }
    }

    private async Task<int> GetUserRank(int reputationScore, CancellationToken cancellationToken)
    {
        var rank = await _context.UserReputations
            .CountAsync(ur => ur.ReputationScore > reputationScore, cancellationToken);
        return rank + 1;
    }
}

public class GetReputationLeaderboardHandler : IRequestHandler<GetReputationLeaderboardQuery, Result<List<UserReputationDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<GetReputationLeaderboardHandler> _logger;

    public GetReputationLeaderboardHandler(
        IApplicationDbContext context,
        ILogger<GetReputationLeaderboardHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<UserReputationDto>>> Handle(GetReputationLeaderboardQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.UserReputations
                .Include(ur => ur.User)
                .AsQueryable();

            // Filter by category if specified
            if (!string.IsNullOrEmpty(request.Category))
            {
                query = query.Where(ur => ur.ExpertiseAreas != null && ur.ExpertiseAreas.Contains(request.Category));
            }

            var userReputations = await query
                .OrderByDescending(ur => ur.ReputationScore)
                .Take(request.Count)
                .ToListAsync(cancellationToken);

            var leaderboard = userReputations.Select((ur, index) => new UserReputationDto
            {
                UserId = ur.UserId,
                UserName = ur.User?.UserName ?? "Unknown",
                Email = ur.User?.Email ?? "Unknown",
                ReputationScore = ur.ReputationScore,
                QuestionsAsked = ur.QuestionsAsked,
                AnswersGiven = ur.AnswersGiven,
                AcceptedAnswers = ur.AcceptedAnswers,
                UpvotesReceived = ur.UpvotesReceived,
                DownvotesReceived = ur.DownvotesReceived,
                BadgesEarned = ur.BadgesEarned?.DeserializeStringList() ?? new List<string>(),
                ExpertiseAreas = ur.ExpertiseAreas?.DeserializeStringList() ?? new List<string>(),
                LastUpdated = ur.LastUpdated,
                Rank = index + 1
            }).ToList();

            return Result<List<UserReputationDto>>.Success(leaderboard);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving reputation leaderboard");
            return Result<List<UserReputationDto>>.Failure(new[] { "Failed to retrieve reputation leaderboard" });
        }
    }
}

public class GetReputationHistoryHandler : IRequestHandler<GetReputationHistoryQuery, Result<PaginatedList<ReputationHistoryDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<GetReputationHistoryHandler> _logger;

    public GetReputationHistoryHandler(
        IApplicationDbContext context,
        ILogger<GetReputationHistoryHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<PaginatedList<ReputationHistoryDto>>> Handle(GetReputationHistoryQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.QAUserActivities
                .Where(ua => ua.UserId == request.UserId)
                .AsQueryable();

            // Apply date filters if specified
            if (request.FromDate.HasValue)
            {
                query = query.Where(ua => ua.CreatedAt >= request.FromDate.Value);
            }

            if (request.ToDate.HasValue)
            {
                query = query.Where(ua => ua.CreatedAt <= request.ToDate.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var activities = await query
                .OrderByDescending(ua => ua.CreatedAt)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(ua => new ReputationHistoryDto
                {
                    Id = ua.Id,
                    UserId = ua.UserId,
                    ActivityType = ua.ActivityType,
                    ContentId = ua.ContentId,
                    Category = ua.Category,
                    ReputationChange = ua.ReputationChange,
                    Description = GetActivityDescription(ua.ActivityType, ua.ReputationChange),
                    CreatedAt = ua.CreatedAt
                })
                .ToListAsync(cancellationToken);

            var result = new PaginatedList<ReputationHistoryDto>(
                activities,
                totalCount,
                request.PageNumber,
                request.PageSize);

            return Result<PaginatedList<ReputationHistoryDto>>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving reputation history for user {UserId}", request.UserId);
            return Result<PaginatedList<ReputationHistoryDto>>.Failure(new[] { "Failed to retrieve reputation history" });
        }
    }

    private static string GetActivityDescription(string activityType, int reputationChange)
    {
        return activityType.ToLower() switch
        {
            "questionasked" => "Asked a question",
            "answergiven" => "Provided an answer",
            "answeraccepted" => $"Answer was accepted (+{reputationChange} reputation)",
            "upvotereceived" => $"Received an upvote (+{reputationChange} reputation)",
            "downvotereceived" => $"Received a downvote ({reputationChange} reputation)",
            "badgeearned" => "Earned a badge",
            _ => $"Activity: {activityType}"
        };
    }
}

public class GetExpertsByCategoryHandler : IRequestHandler<GetExpertsByCategory, Result<List<ExpertDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<GetExpertsByCategoryHandler> _logger;

    public GetExpertsByCategoryHandler(
        IApplicationDbContext context,
        ILogger<GetExpertsByCategoryHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<List<ExpertDto>>> Handle(GetExpertsByCategory request, CancellationToken cancellationToken)
    {
        try
        {
            // First get the category
            var category = await _context.QACategories
                .FirstOrDefaultAsync(c => c.Name == request.Category, cancellationToken);

            if (category == null)
            {
                return Result<List<ExpertDto>>.Success(new List<ExpertDto>());
            }

            // Get experts for this category
            var experts = await _context.QAExperts
                .Include(e => e.User)
                .Where(e => e.CategoryId == category.Id)
                .ToListAsync(cancellationToken);

            // Get reputation data for these users
            var userIds = experts.Select(e => e.UserId).ToList();
            var reputations = await _context.UserReputations
                .Where(r => userIds.Contains(r.UserId))
                .ToListAsync(cancellationToken);

            var expertDtos = experts.Select(expert =>
            {
                var reputation = reputations.FirstOrDefault(r => r.UserId == expert.UserId);
                return new ExpertDto
                {
                    UserId = expert.UserId,
                    UserName = expert.User?.UserName ?? "Unknown",
                    Category = request.Category,
                    ExpertiseLevel = expert.ExpertiseLevel,
                    AnswerCount = expert.AnswerCount,
                    AcceptedAnswerCount = expert.AcceptedAnswerCount,
                    AverageRating = expert.AverageRating,
                    ResponseRate = expert.ResponseRate,
                    ReputationScore = reputation?.ReputationScore ?? 0,
                    BadgesEarned = reputation?.BadgesEarned?.DeserializeStringList() ?? new List<string>()
                };
            })
            .OrderByDescending(e => e.ReputationScore)
            .ThenByDescending(e => e.AcceptedAnswerCount)
            .Take(request.Count)
            .ToList();

            return Result<List<ExpertDto>>.Success(expertDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving experts for category {Category}", request.Category);
            return Result<List<ExpertDto>>.Failure(new[] { "Failed to retrieve experts" });
        }
    }
}