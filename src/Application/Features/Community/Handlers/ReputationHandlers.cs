using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Community.Commands;
using Application.Features.Community.DTOs.Responses;
using Application.Features.Community.Extensions;
using Domain.Entities.Community.QA;
using Domain.Entities.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Community.Handlers;

public class UpdateExpertiseAreasHandler : IRequestHandler<UpdateExpertiseAreasCommand, Result<UserReputationDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<UpdateExpertiseAreasHandler> _logger;

    public UpdateExpertiseAreasHandler(
        IApplicationDbContext context,
        ILogger<UpdateExpertiseAreasHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<UserReputationDto>> Handle(UpdateExpertiseAreasCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Get or create user reputation record
            var userReputation = await _context.UserReputations
                .FirstOrDefaultAsync(ur => ur.UserId == request.UserId, cancellationToken);

            if (userReputation == null)
            {
                userReputation = new UserReputation
                {
                    Id = Guid.NewGuid(),
                    UserId = request.UserId,
                    ReputationScore = 0,
                    ExpertiseAreas = request.ExpertiseAreas.SerializeStringList(),
                    LastUpdated = DateTime.UtcNow
                };
                _context.UserReputations.Add(userReputation);
            }
            else
            {
                userReputation.ExpertiseAreas = request.ExpertiseAreas.SerializeStringList();
                userReputation.LastUpdated = DateTime.UtcNow;
            }

            // Update or create expert records for each category
            var existingExperts = await _context.Experts
                .Include(e => e.Category)
                .Where(e => e.UserId == request.UserId)
                .ToListAsync(cancellationToken);

            // Remove expertise areas that are no longer selected
            var expertsToRemove = existingExperts
                .Where(e => !request.ExpertiseAreas.Contains(e.Category.Name))
                .ToList();

            foreach (var expert in expertsToRemove)
            {
                _context.Experts.Remove(expert);
            }

            // Add new expertise areas
            var categories = await _context.Categories
                .Where(c => request.ExpertiseAreas.Contains(c.Name))
                .ToListAsync(cancellationToken);

            foreach (var category in categories)
            {
                var existingExpert = existingExperts
                    .FirstOrDefault(e => e.CategoryId == category.Id);

                if (existingExpert == null)
                {
                    var newExpert = new Expert
                    {
                        Id = Guid.NewGuid(),
                        UserId = request.UserId,
                        CategoryId = category.Id,
                        ExpertiseLevel = "Beginner",
                        NotificationEnabled = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    _context.Experts.Add(newExpert);
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Get user information for response
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            var result = new UserReputationDto
            {
                UserId = userReputation.UserId,
                UserName = user?.UserName ?? "Unknown",
                Email = user?.Email ?? "Unknown",
                ReputationScore = userReputation.ReputationScore,
                QuestionsAsked = userReputation.QuestionsAsked,
                AnswersGiven = userReputation.AnswersGiven,
                AcceptedAnswers = userReputation.AcceptedAnswers,
                UpvotesReceived = userReputation.UpvotesReceived,
                DownvotesReceived = userReputation.DownvotesReceived,
                BadgesEarned = userReputation.BadgesEarned?.DeserializeStringList() ?? new List<string>(),
                ExpertiseAreas = userReputation.ExpertiseAreas?.DeserializeStringList() ?? new List<string>(),
                LastUpdated = userReputation.LastUpdated
            };

            _logger.LogInformation("Updated expertise areas for user {UserId}", request.UserId);
            return Result<UserReputationDto>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating expertise areas for user {UserId}", request.UserId);
            return Result<UserReputationDto>.Failure(new[] { "Failed to update expertise areas" });
        }
    }
}

public class AwardBadgeHandler : IRequestHandler<AwardBadgeCommand, Result<UserReputationDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<AwardBadgeHandler> _logger;

    public AwardBadgeHandler(
        IApplicationDbContext context,
        ILogger<AwardBadgeHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<UserReputationDto>> Handle(AwardBadgeCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Get or create user reputation record
            var userReputation = await _context.UserReputations
                .FirstOrDefaultAsync(ur => ur.UserId == request.UserId, cancellationToken);

            if (userReputation == null)
            {
                userReputation = new UserReputation
                {
                    Id = Guid.NewGuid(),
                    UserId = request.UserId,
                    ReputationScore = 0,
                    BadgesEarned = new List<string> { request.BadgeName }.SerializeStringList(),
                    LastUpdated = DateTime.UtcNow
                };
                _context.UserReputations.Add(userReputation);
            }
            else
            {
                var currentBadges = userReputation.BadgesEarned?.DeserializeStringList() ?? new List<string>();
                if (!currentBadges.Contains(request.BadgeName))
                {
                    currentBadges.Add(request.BadgeName);
                    userReputation.BadgesEarned = currentBadges.SerializeStringList();
                    userReputation.LastUpdated = DateTime.UtcNow;
                }
            }

            // Log the badge award activity
            var activity = new UserActivity
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                ActivityType = "BadgeEarned",
                ContentId = Guid.NewGuid(), // Badge award doesn't have specific content
                Category = "System",
                ReputationChange = 0,
                CreatedAt = DateTime.UtcNow
            };
            _context.CommunityUserActivities.Add(activity);

            await _context.SaveChangesAsync(cancellationToken);

            // Get user information for response
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            var result = new UserReputationDto
            {
                UserId = userReputation.UserId,
                UserName = user?.UserName ?? "Unknown",
                Email = user?.Email ?? "Unknown",
                ReputationScore = userReputation.ReputationScore,
                QuestionsAsked = userReputation.QuestionsAsked,
                AnswersGiven = userReputation.AnswersGiven,
                AcceptedAnswers = userReputation.AcceptedAnswers,
                UpvotesReceived = userReputation.UpvotesReceived,
                DownvotesReceived = userReputation.DownvotesReceived,
                BadgesEarned = userReputation.BadgesEarned?.DeserializeStringList() ?? new List<string>(),
                ExpertiseAreas = userReputation.ExpertiseAreas?.DeserializeStringList() ?? new List<string>(),
                LastUpdated = userReputation.LastUpdated
            };

            _logger.LogInformation("Awarded badge {BadgeName} to user {UserId}", request.BadgeName, request.UserId);
            return Result<UserReputationDto>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error awarding badge {BadgeName} to user {UserId}", request.BadgeName, request.UserId);
            return Result<UserReputationDto>.Failure(new[] { "Failed to award badge" });
        }
    }
}

public class UpdateReputationHandler : IRequestHandler<UpdateReputationCommand, Result<UserReputationDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<UpdateReputationHandler> _logger;

    public UpdateReputationHandler(
        IApplicationDbContext context,
        ILogger<UpdateReputationHandler> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<UserReputationDto>> Handle(UpdateReputationCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Get or create user reputation record
            var userReputation = await _context.UserReputations
                .FirstOrDefaultAsync(ur => ur.UserId == request.UserId, cancellationToken);

            if (userReputation == null)
            {
                userReputation = new UserReputation
                {
                    Id = Guid.NewGuid(),
                    UserId = request.UserId,
                    ReputationScore = Math.Max(0, request.ReputationChange), // Ensure reputation doesn't go negative
                    LastUpdated = DateTime.UtcNow
                };
                _context.UserReputations.Add(userReputation);
            }
            else
            {
                userReputation.ReputationScore = Math.Max(0, userReputation.ReputationScore + request.ReputationChange);
                userReputation.LastUpdated = DateTime.UtcNow;

                // Update activity counters based on activity type
                switch (request.ActivityType.ToLower())
                {
                    case "questionasked":
                        userReputation.QuestionsAsked++;
                        break;
                    case "answergiven":
                        userReputation.AnswersGiven++;
                        break;
                    case "answeraccepted":
                        userReputation.AcceptedAnswers++;
                        break;
                    case "upvotereceived":
                        userReputation.UpvotesReceived++;
                        break;
                    case "downvotereceived":
                        userReputation.DownvotesReceived++;
                        break;
                }
            }

            // Log the reputation change activity
            var activity = new UserActivity
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                ActivityType = request.ActivityType,
                ContentId = request.ContentId,
                Category = request.Category,
                ReputationChange = request.ReputationChange,
                CreatedAt = DateTime.UtcNow
            };
            _context.CommunityUserActivities.Add(activity);

            // Check for new badges based on reputation milestones
            await CheckAndAwardReputationBadges(userReputation, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            // Get user information for response
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            var result = new UserReputationDto
            {
                UserId = userReputation.UserId,
                UserName = user?.UserName ?? "Unknown",
                Email = user?.Email ?? "Unknown",
                ReputationScore = userReputation.ReputationScore,
                QuestionsAsked = userReputation.QuestionsAsked,
                AnswersGiven = userReputation.AnswersGiven,
                AcceptedAnswers = userReputation.AcceptedAnswers,
                UpvotesReceived = userReputation.UpvotesReceived,
                DownvotesReceived = userReputation.DownvotesReceived,
                BadgesEarned = userReputation.BadgesEarned?.DeserializeStringList() ?? new List<string>(),
                ExpertiseAreas = userReputation.ExpertiseAreas?.DeserializeStringList() ?? new List<string>(),
                LastUpdated = userReputation.LastUpdated
            };

            _logger.LogInformation("Updated reputation for user {UserId} by {ReputationChange} points", 
                request.UserId, request.ReputationChange);
            return Result<UserReputationDto>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating reputation for user {UserId}", request.UserId);
            return Result<UserReputationDto>.Failure(new[] { "Failed to update reputation" });
        }
    }

    private async Task CheckAndAwardReputationBadges(UserReputation userReputation, CancellationToken cancellationToken)
    {
        var currentBadges = userReputation.BadgesEarned?.DeserializeStringList() ?? new List<string>();
        var badgesToAward = new List<string>();

        // Reputation milestone badges
        if (userReputation.ReputationScore >= 100 && !currentBadges.Contains("Contributor"))
            badgesToAward.Add("Contributor");
        
        if (userReputation.ReputationScore >= 500 && !currentBadges.Contains("Knowledgeable"))
            badgesToAward.Add("Knowledgeable");
        
        if (userReputation.ReputationScore >= 1000 && !currentBadges.Contains("Helpful"))
            badgesToAward.Add("Helpful");
        
        if (userReputation.ReputationScore >= 2000 && !currentBadges.Contains("Expert"))
            badgesToAward.Add("Expert");
        
        if (userReputation.ReputationScore >= 5000 && !currentBadges.Contains("Master"))
            badgesToAward.Add("Master");

        // Activity-based badges
        if (userReputation.AcceptedAnswers >= 10 && !currentBadges.Contains("Good Answer"))
            badgesToAward.Add("Good Answer");
        
        if (userReputation.AcceptedAnswers >= 25 && !currentBadges.Contains("Great Answer"))
            badgesToAward.Add("Great Answer");
        
        if (userReputation.UpvotesReceived >= 50 && !currentBadges.Contains("Popular"))
            badgesToAward.Add("Popular");

        // Award new badges
        if (badgesToAward.Any())
        {
            currentBadges.AddRange(badgesToAward);
            userReputation.BadgesEarned = currentBadges.SerializeStringList();

            foreach (var badge in badgesToAward)
            {
                // Log badge award activity
                var badgeActivity = new UserActivity
                {
                    Id = Guid.NewGuid(),
                    UserId = userReputation.UserId,
                    ActivityType = "BadgeEarned",
                    ContentId = Guid.NewGuid(),
                    Category = "System",
                    ReputationChange = 0,
                    CreatedAt = DateTime.UtcNow
                };
                _context.CommunityUserActivities.Add(badgeActivity);
            }
        }
    }
}
