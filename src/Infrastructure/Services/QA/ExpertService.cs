using Application.Features.Community.QA.Services;
using Domain.Entities.Community.QA;
using Domain.Entities.Identity;
using Domain.Events.Community;
using Domain.Interfaces;
using Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.QA;
public class ExpertService : IExpertService
{
    private readonly IRepository<QAExpert> _expertRepository;
    private readonly IRepository<UserReputation> _reputationRepository;
    private readonly IRepository<Answer> _answerRepository;
    private readonly IRepository<Question> _questionRepository;
    private readonly IRepository<QuestionCategory> _categoryRepository;
    private readonly IRepository<ApplicationUser> _userRepository;
    private readonly IExpertIdentificationService _expertIdentificationService;
    private readonly Application.Features.Community.QA.Services.IReputationService _reputationService;
    private readonly IMediator _mediator;
    private readonly ILogger<ExpertService> _logger;

    public ExpertService(
        IRepository<QAExpert> expertRepository,
        IRepository<UserReputation> reputationRepository,
        IRepository<Answer> answerRepository,
        IRepository<Question> questionRepository,
        IRepository<QuestionCategory> categoryRepository,
        IRepository<ApplicationUser> userRepository,
        IExpertIdentificationService expertIdentificationService,
        Application.Features.Community.QA.Services.IReputationService reputationService,
        IMediator mediator,
        ILogger<ExpertService> logger)
    {
        _expertRepository = expertRepository;
        _reputationRepository = reputationRepository;
        _answerRepository = answerRepository;
        _questionRepository = questionRepository;
        _categoryRepository = categoryRepository;
        _userRepository = userRepository;
        _expertIdentificationService = expertIdentificationService;
        _reputationService = reputationService;
        _mediator = mediator;
        _logger = logger;
    }

    #region Expert Detection and Ranking

    public async Task<List<Guid>> GetExpertsByCategoryAsync(string category)
    {
        try
        {
            var experts = await _expertRepository.GetAllAsync();
            var categoryExperts = experts
                .Where(e => e.Category.Name.Equals(category, StringComparison.OrdinalIgnoreCase))
                .Select(e => e.UserId)
                .ToList();

            return categoryExperts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting experts for category {Category}", category);
            return new List<Guid>();
        }
    }

    public async Task<List<ExpertRankingDto>> GetRankedExpertsAsync(string category, int count = 10)
    {
        try
        {
            var rankings = await _expertIdentificationService.RankExpertsInCategoryAsync(category);
            var users = await _userRepository.GetAllAsync();
            var reputations = await _reputationRepository.GetAllAsync();

            var rankedExperts = rankings.Take(count).Select(r =>
            {
                var user = users.FirstOrDefault(u => u.Id == r.UserId);
                var reputation = reputations.FirstOrDefault(rep => rep.UserId == r.UserId);

                return new ExpertRankingDto
                {
                    UserId = r.UserId,
                    UserName = user?.UserName ?? "Unknown",
                    ExpertiseLevel = r.Level.ToString(),
                    AnswerCount = r.AcceptedAnswers,
                    AcceptedAnswerCount = r.AcceptedAnswers,
                    AverageRating = r.AverageRating,
                    ResponseRate = r.ResponseRate,
                    ReputationScore = reputation?.ReputationScore ?? 0,
                    Badges = new List<string>() // TODO: Implement badge system
                };
            }).ToList();

            return rankedExperts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting ranked experts for category {Category}", category);
            return new List<ExpertRankingDto>();
        }
    }

    public async Task UpdateExpertStatsAsync(Guid userId, string category, string activityType)
    {
        try
        {
            var experts = await _expertRepository.GetAllAsync();
            var expert = experts.FirstOrDefault(e => e.UserId == userId && 
                e.Category.Name.Equals(category, StringComparison.OrdinalIgnoreCase));

            if (expert == null)
            {
                // Create new expert record if doesn't exist
                var categories = await _categoryRepository.GetAllAsync();
                var categoryEntity = categories.FirstOrDefault(c => c.Name.Equals(category, StringComparison.OrdinalIgnoreCase));
                
                if (categoryEntity != null)
                {
                    expert = new QAExpert
                    {
                        UserId = userId,
                        CategoryId = categoryEntity.Id,
                        ExpertiseLevel = "Beginner",
                        AnswerCount = 0,
                        AcceptedAnswerCount = 0,
                        AverageRating = 0,
                        ResponseRate = 0,
                        NotificationEnabled = true
                    };
                    await _expertRepository.AddAsync(expert);
                }
            }

            if (expert != null)
            {
                // Update stats based on activity type
                switch (activityType.ToLower())
                {
                    case "answer_created":
                        expert.AnswerCount++;
                        break;
                    case "answer_accepted":
                        expert.AcceptedAnswerCount++;
                        break;
                    case "vote_received":
                        // Recalculate average rating
                        await RecalculateExpertRatingAsync(expert);
                        break;
                }

                // Update expertise level
                expert.ExpertiseLevel = await DetermineExpertiseLevelAsync(userId, category);
                await _expertRepository.UpdateAsync(expert);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating expert stats for user {UserId} in category {Category}", userId, category);
        }
    }

    public async Task<bool> IsUserExpertInCategoryAsync(Guid userId, string category)
    {
        try
        {
            var experts = await _expertRepository.GetAllAsync();
            var expert = experts.FirstOrDefault(e => e.UserId == userId && 
                e.Category.Name.Equals(category, StringComparison.OrdinalIgnoreCase));

            return expert != null && (expert.ExpertiseLevel == "Expert" || expert.ExpertiseLevel == "Master");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if user {UserId} is expert in category {Category}", userId, category);
            return false;
        }
    }

    public async Task PromoteToExpertAsync(Guid userId, string category)
    {
        try
        {
            var experts = await _expertRepository.GetAllAsync();
            var expert = experts.FirstOrDefault(e => e.UserId == userId && 
                e.Category.Name.Equals(category, StringComparison.OrdinalIgnoreCase));

            if (expert == null)
            {
                var categories = await _categoryRepository.GetAllAsync();
                var categoryEntity = categories.FirstOrDefault(c => c.Name.Equals(category, StringComparison.OrdinalIgnoreCase));
                
                if (categoryEntity != null)
                {
                    expert = new QAExpert
                    {
                        UserId = userId,
                        CategoryId = categoryEntity.Id,
                        ExpertiseLevel = "Expert",
                        AnswerCount = 0,
                        AcceptedAnswerCount = 0,
                        AverageRating = 0,
                        ResponseRate = 0,
                        NotificationEnabled = true
                    };
                    await _expertRepository.AddAsync(expert);
                }
            }
            else
            {
                expert.ExpertiseLevel = "Expert";
                await _expertRepository.UpdateAsync(expert);
            }

            // Raise domain event for expert promotion
            var expertPromotedEvent = new ExpertPromotedEvent(userId, category, "Expert", "Promoted to expert status");
            await _mediator.Publish(expertPromotedEvent);

            // Award expert badge
            await _reputationService.AwardBadgeAsync(userId, $"Expert in {category}", $"Promoted to expert in {category}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error promoting user {UserId} to expert in category {Category}", userId, category);
        }
    }

    public async Task<string> DetermineExpertiseLevelAsync(Guid userId, string category)
    {
        try
        {
            var answers = await _answerRepository.GetAllAsync();
            var userAnswers = answers.Where(a => a.UserId == userId && !a.IsDeleted).ToList();
            
            var reputations = await _reputationRepository.GetAllAsync();
            var userReputation = reputations.FirstOrDefault(r => r.UserId == userId);

            var acceptedAnswers = userAnswers.Count(a => a.IsAccepted);
            var averageRating = userAnswers.Any() ? userAnswers.Average(a => a.UpvotesCount - a.DownvotesCount) : 0;
            var responseRate = 85.0m; // Placeholder
            var reputationScore = userReputation?.ReputationScore ?? 0;
            var totalAnswers = userAnswers.Count;

            var level = _expertIdentificationService.DetermineExpertiseLevel(
                acceptedAnswers, (decimal)averageRating, responseRate, reputationScore, totalAnswers);

            return level.ToString();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error determining expertise level for user {UserId} in category {Category}", userId, category);
            return "Beginner";
        }
    }

    #endregion

    #region Expert Notification System

    public async Task NotifyExpertsForQuestionAsync(Guid questionId, string category)
    {
        try
        {
            var notifiableExperts = await GetNotifiableExpertsAsync(category);
            
            // TODO: Implement actual notification sending (email, push, SignalR)
            foreach (var expertId in notifiableExperts)
            {
                _logger.LogInformation("Notifying expert {ExpertId} about question {QuestionId} in category {Category}", 
                    expertId, questionId, category);
                // Send notification logic here
            }

            // Raise domain event for expert notifications
            if (notifiableExperts.Any())
            {
                var expertNotificationEvent = new ExpertNotificationSentEvent(questionId, category, notifiableExperts);
                await _mediator.Publish(expertNotificationEvent);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error notifying experts for question {QuestionId} in category {Category}", questionId, category);
        }
    }

    public async Task<List<Guid>> GetNotifiableExpertsAsync(string category)
    {
        try
        {
            var experts = await _expertRepository.GetAllAsync();
            var notifiableExperts = experts
                .Where(e => e.Category.Name.Equals(category, StringComparison.OrdinalIgnoreCase) && 
                           e.NotificationEnabled &&
                           (e.ExpertiseLevel == "Expert" || e.ExpertiseLevel == "Master"))
                .Select(e => e.UserId)
                .ToList();

            return notifiableExperts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notifiable experts for category {Category}", category);
            return new List<Guid>();
        }
    }

    public async Task UpdateExpertNotificationPreferencesAsync(Guid userId, string category, bool enabled)
    {
        try
        {
            var experts = await _expertRepository.GetAllAsync();
            var expert = experts.FirstOrDefault(e => e.UserId == userId && 
                e.Category.Name.Equals(category, StringComparison.OrdinalIgnoreCase));

            if (expert != null)
            {
                expert.NotificationEnabled = enabled;
                await _expertRepository.UpdateAsync(expert);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating notification preferences for user {UserId} in category {Category}", userId, category);
        }
    }

    public async Task<Dictionary<string, bool>> GetExpertNotificationPreferencesAsync(Guid userId)
    {
        try
        {
            var experts = await _expertRepository.GetAllAsync();
            var userExperts = experts.Where(e => e.UserId == userId).ToList();

            var preferences = new Dictionary<string, bool>();
            foreach (var expert in userExperts)
            {
                preferences[expert.Category.Name] = expert.NotificationEnabled;
            }

            return preferences;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notification preferences for user {UserId}", userId);
            return new Dictionary<string, bool>();
        }
    }

    #endregion

    #region Expert Badge and Recognition

    public async Task CheckAndAwardExpertBadgesAsync(Guid userId, string category)
    {
        try
        {
            var expert = await GetExpertByCategoryAsync(userId, category);
            if (expert == null) return;

            var badges = new List<string>();

            // Check for various badge criteria
            if (expert.AcceptedAnswerCount >= 10)
                badges.Add($"Helpful Expert in {category}");
            
            if (expert.AcceptedAnswerCount >= 50)
                badges.Add($"Master Expert in {category}");
            
            if (expert.AverageRating >= 4.5m)
                badges.Add($"Highly Rated Expert in {category}");

            // Award new badges
            foreach (var badge in badges)
            {
                if (!await HasExpertBadgeAsync(userId, badge))
                {
                    await _reputationService.AwardBadgeAsync(userId, badge, $"Earned for expertise in {category}");
                    
                    // Raise domain event for badge awarded
                    var badgeAwardedEvent = new ExpertBadgeAwardedEvent(userId, badge, category, $"Earned for expertise in {category}");
                    await _mediator.Publish(badgeAwardedEvent);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking and awarding expert badges for user {UserId} in category {Category}", userId, category);
        }
    }

    public async Task<List<string>> GetExpertBadgesAsync(Guid userId)
    {
        try
        {
            // TODO: Implement badge retrieval from reputation system
            return new List<string>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert badges for user {UserId}", userId);
            return new List<string>();
        }
    }

    public async Task<bool> HasExpertBadgeAsync(Guid userId, string category)
    {
        try
        {
            // TODO: Implement badge checking from reputation system
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking expert badge for user {UserId} in category {Category}", userId, category);
            return false;
        }
    }

    #endregion

    #region Expert Preference Management

    public async Task<List<string>> GetUserExpertiseCategoriesAsync(Guid userId)
    {
        try
        {
            var experts = await _expertRepository.GetAllAsync();
            var userCategories = experts
                .Where(e => e.UserId == userId)
                .Select(e => e.Category.Name)
                .ToList();

            return userCategories;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expertise categories for user {UserId}", userId);
            return new List<string>();
        }
    }

    public async Task AddExpertiseCategoryAsync(Guid userId, string category)
    {
        try
        {
            var categories = await _categoryRepository.GetAllAsync();
            var categoryEntity = categories.FirstOrDefault(c => c.Name.Equals(category, StringComparison.OrdinalIgnoreCase));
            
            if (categoryEntity != null)
            {
                var experts = await _expertRepository.GetAllAsync();
                var existingExpert = experts.FirstOrDefault(e => e.UserId == userId && e.CategoryId == categoryEntity.Id);
                
                if (existingExpert == null)
                {
                    var expert = new QAExpert
                    {
                        UserId = userId,
                        CategoryId = categoryEntity.Id,
                        ExpertiseLevel = "Beginner",
                        AnswerCount = 0,
                        AcceptedAnswerCount = 0,
                        AverageRating = 0,
                        ResponseRate = 0,
                        NotificationEnabled = true
                    };
                    await _expertRepository.AddAsync(expert);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding expertise category {Category} for user {UserId}", category, userId);
        }
    }

    public async Task RemoveExpertiseCategoryAsync(Guid userId, string category)
    {
        try
        {
            var experts = await _expertRepository.GetAllAsync();
            var expert = experts.FirstOrDefault(e => e.UserId == userId && 
                e.Category.Name.Equals(category, StringComparison.OrdinalIgnoreCase));

            if (expert != null)
            {
                await _expertRepository.DeleteAsync(expert);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing expertise category {Category} for user {UserId}", category, userId);
        }
    }

    public async Task UpdateExpertPreferencesAsync(Guid userId, ExpertPreferencesDto preferences)
    {
        try
        {
            // Update notification preferences for each category
            foreach (var categoryPref in preferences.CategoryNotifications)
            {
                await UpdateExpertNotificationPreferencesAsync(userId, categoryPref.Key, categoryPref.Value);
            }

            // TODO: Store other preferences (email, push, quiet hours, etc.) in user profile or separate table
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating expert preferences for user {UserId}", userId);
        }
    }

    public async Task<ExpertPreferencesDto> GetExpertPreferencesAsync(Guid userId)
    {
        try
        {
            var categoryNotifications = await GetExpertNotificationPreferencesAsync(userId);
            
            return new ExpertPreferencesDto
            {
                UserId = userId,
                CategoryNotifications = categoryNotifications,
                EmailNotifications = true, // TODO: Get from user profile
                PushNotifications = true,
                MaxQuestionsPerDay = 10,
                PreferredTags = new List<string>(),
                TimeZone = "UTC",
                QuietHoursEnabled = false,
                QuietHoursStart = TimeSpan.FromHours(22),
                QuietHoursEnd = TimeSpan.FromHours(8)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert preferences for user {UserId}", userId);
            return new ExpertPreferencesDto { UserId = userId };
        }
    }

    #endregion

    #region Expert Analytics

    public async Task<ExpertAnalyticsDto> GetExpertAnalyticsAsync(Guid userId, string? category = null)
    {
        try
        {
            var answers = await _answerRepository.GetAllAsync();
            var userAnswers = answers.Where(a => a.UserId == userId && !a.IsDeleted).ToList();
            
            var reputations = await _reputationRepository.GetAllAsync();
            var userReputation = reputations.FirstOrDefault(r => r.UserId == userId);

            var totalAnswers = userAnswers.Count;
            var acceptedAnswers = userAnswers.Count(a => a.IsAccepted);
            var acceptanceRate = totalAnswers > 0 ? (decimal)acceptedAnswers / totalAnswers * 100 : 0;
            var averageRating = userAnswers.Any() ? (decimal)userAnswers.Average(a => a.UpvotesCount - a.DownvotesCount) : 0;
            var totalUpvotes = userAnswers.Sum(a => a.UpvotesCount);
            var totalDownvotes = userAnswers.Sum(a => a.DownvotesCount);

            return new ExpertAnalyticsDto
            {
                UserId = userId,
                TotalAnswers = totalAnswers,
                AcceptedAnswers = acceptedAnswers,
                AcceptanceRate = acceptanceRate,
                AverageRating = averageRating,
                TotalUpvotes = totalUpvotes,
                TotalDownvotes = totalDownvotes,
                AnswersByCategory = new Dictionary<string, int>(), // TODO: Implement category breakdown
                ExpertiseLevels = new Dictionary<string, string>(), // TODO: Implement expertise levels by category
                EarnedBadges = new List<string>(), // TODO: Get from badge system
                LastActivity = userAnswers.Any() ? userAnswers.Max(a => a.CreatedAt) : DateTime.MinValue,
                ReputationScore = userReputation?.ReputationScore ?? 0
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert analytics for user {UserId}", userId);
            return new ExpertAnalyticsDto { UserId = userId };
        }
    }

    public async Task<List<ExpertLeaderboardDto>> GetExpertLeaderboardAsync(string category, int count = 10)
    {
        try
        {
            var rankedExperts = await GetRankedExpertsAsync(category, count);
            
            return rankedExperts.Select((expert, index) => new ExpertLeaderboardDto
            {
                UserId = expert.UserId,
                UserName = expert.UserName,
                ExpertiseLevel = expert.ExpertiseLevel,
                AcceptedAnswers = expert.AcceptedAnswerCount,
                AverageRating = expert.AverageRating,
                ReputationScore = expert.ReputationScore,
                Rank = index + 1
            }).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert leaderboard for category {Category}", category);
            return new List<ExpertLeaderboardDto>();
        }
    }

    public async Task<ExpertPerformanceDto> GetExpertPerformanceAsync(Guid userId, string category)
    {
        try
        {
            var expert = await GetExpertByCategoryAsync(userId, category);
            if (expert == null)
            {
                return new ExpertPerformanceDto
                {
                    UserId = userId,
                    Category = category,
                    ExpertiseLevel = "Beginner"
                };
            }

            var answers = await _answerRepository.GetAllAsync();
            var userAnswers = answers.Where(a => a.UserId == userId && !a.IsDeleted).ToList();
            var acceptanceRate = expert.AnswerCount > 0 ? (decimal)expert.AcceptedAnswerCount / expert.AnswerCount * 100 : 0;

            return new ExpertPerformanceDto
            {
                UserId = userId,
                Category = category,
                ExpertiseLevel = expert.ExpertiseLevel,
                AnswerCount = expert.AnswerCount,
                AcceptedAnswerCount = expert.AcceptedAnswerCount,
                AcceptanceRate = acceptanceRate,
                AverageRating = expert.AverageRating,
                ResponseRate = expert.ResponseRate,
                LastActivity = userAnswers.Any() ? userAnswers.Max(a => a.CreatedAt) : DateTime.MinValue,
                RecentBadges = new List<string>() // TODO: Get recent badges
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting expert performance for user {UserId} in category {Category}", userId, category);
            return new ExpertPerformanceDto { UserId = userId, Category = category };
        }
    }

    #endregion

    #region Private Helper Methods

    private async Task<QAExpert?> GetExpertByCategoryAsync(Guid userId, string category)
    {
        var experts = await _expertRepository.GetAllAsync();
        return experts.FirstOrDefault(e => e.UserId == userId && 
            e.Category.Name.Equals(category, StringComparison.OrdinalIgnoreCase));
    }

    private async Task RecalculateExpertRatingAsync(QAExpert expert)
    {
        try
        {
            var answers = await _answerRepository.GetAllAsync();
            var userAnswers = answers.Where(a => a.UserId == expert.UserId && !a.IsDeleted).ToList();
            
            if (userAnswers.Any())
            {
                expert.AverageRating = (decimal)userAnswers.Average(a => a.UpvotesCount - a.DownvotesCount);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recalculating expert rating for user {UserId}", expert.UserId);
        }
    }

    #endregion
}