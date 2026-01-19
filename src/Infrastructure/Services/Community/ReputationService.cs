using Application.Common.Interfaces;
using Application.Features.Community.QA.Services;
using Domain.Entities.Community.QA;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.QA;

public class ReputationService : IReputationService
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<ReputationService> _logger;

    // Reputation requirements for different actions
    private static readonly Dictionary<string, int> ReputationRequirements = new()
    {
        { "Downvote", 125 }, // Minimum reputation required to downvote
        { "Comment", 50 },   // Minimum reputation required to comment
        { "EditOthers", 2000 }, // Minimum reputation required to edit others' posts
        { "CloseVote", 3000 }, // Minimum reputation required to vote to close
        { "Moderate", 10000 }  // Minimum reputation required for moderation actions
    };

    public ReputationService(IApplicationDbContext context, ILogger<ReputationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> CalculateReputationChangeAsync(string activityType, Guid userId, Guid contentId)
    {
        await Task.CompletedTask;
        
        return activityType switch
        {
            "QuestionAsked" => 0,
            "AnswerGiven" => 5,
            "AnswerAccepted" => 25,
            "UpvoteReceived" => 10,
            "DownvoteReceived" => -2,
            "UpvoteRemoved" => -10, // Reverse of upvote received
            "DownvoteRemoved" => 2,  // Reverse of downvote received
            "VoteChanged" => 0, // Net change calculated in handler
            _ => 0
        };
    }

    public async Task UpdateUserReputationAsync(Guid userId, int reputationChange, string activityType, Guid contentId, string category)
    {
        try
        {
            if (reputationChange == 0) return;

            // Get or create user reputation record
            var userReputation = await _context.UserReputations
                .FirstOrDefaultAsync(ur => ur.UserId == userId);

            if (userReputation == null)
            {
                userReputation = new UserReputation
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ReputationScore = 0,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = userId.ToString()
                };
                _context.UserReputations.Add(userReputation);
            }

            // Update reputation score
            var oldScore = userReputation.ReputationScore;
            userReputation.ReputationScore = Math.Max(0, userReputation.ReputationScore + reputationChange);
            userReputation.LastUpdated = DateTime.UtcNow;
            userReputation.UpdatedAt = DateTime.UtcNow;
            userReputation.UpdatedBy = userId.ToString();

            // Update activity counters based on activity type
            switch (activityType)
            {
                case "UpvoteReceived":
                    userReputation.UpvotesReceived++;
                    break;
                case "DownvoteReceived":
                    userReputation.DownvotesReceived++;
                    break;
                case "UpvoteRemoved":
                    userReputation.UpvotesReceived = Math.Max(0, userReputation.UpvotesReceived - 1);
                    break;
                case "DownvoteRemoved":
                    userReputation.DownvotesReceived = Math.Max(0, userReputation.DownvotesReceived - 1);
                    break;
                case "AnswerAccepted":
                    userReputation.AcceptedAnswers++;
                    break;
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("Reputation updated for user {UserId}. Activity: {ActivityType}, Change: {Change}, Old Score: {OldScore}, New Score: {NewScore}",
                userId, activityType, reputationChange, oldScore, userReputation.ReputationScore);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating reputation for user {UserId}", userId);
            throw;
        }
    }

    public async Task AwardBadgeAsync(Guid userId, string badgeName, string reason)
    {
        // TODO: Implement badge awarding logic
        // This will be implemented in later tasks
        await Task.CompletedTask;
    }

    public async Task<List<string>> CheckForNewBadgesAsync(Guid userId)
    {
        // TODO: Implement badge checking logic
        // This will be implemented in later tasks with proper milestone detection
        await Task.CompletedTask;
        return new List<string>();
    }

    public async Task<bool> HasSufficientReputationAsync(Guid userId, string action)
    {
        try
        {
            if (!ReputationRequirements.TryGetValue(action, out var requiredReputation))
            {
                // If action is not in requirements, allow it
                return true;
            }

            var userReputation = await _context.UserReputations
                .FirstOrDefaultAsync(ur => ur.UserId == userId);

            var currentReputation = userReputation?.ReputationScore ?? 0;
            var hasSufficient = currentReputation >= requiredReputation;

            _logger.LogDebug("Reputation check for user {UserId}, action {Action}: Current={Current}, Required={Required}, Sufficient={Sufficient}",
                userId, action, currentReputation, requiredReputation, hasSufficient);

            return hasSufficient;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking reputation for user {UserId}, action {Action}", userId, action);
            // In case of error, be permissive to avoid blocking users
            return true;
        }
    }

    public async Task RecalculateUserReputationAsync(Guid userId)
    {
        // TODO: Implement reputation recalculation logic
        // This will be implemented in later tasks
        await Task.CompletedTask;
    }
}