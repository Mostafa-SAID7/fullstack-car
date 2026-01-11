using Domain.Entities.Community.QA;
using Domain.Enums.Community.QA;
using Domain.ValueObjects.Community;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Domain.Services
{
    public class ReputationDomainService : IReputationService
    {
        private readonly IRepository<UserReputation> _userReputationRepository;
        private readonly IRepository<QAUserActivity> _activityRepository;
        private readonly ILogger<ReputationDomainService> _logger;

        // Reputation point values for different activities
        private static readonly Dictionary<ActivityType, int> ReputationPoints = new()
        {
            { ActivityType.QuestionAsked, 0 },
            { ActivityType.AnswerGiven, 5 },
            { ActivityType.VoteCast, 0 },
            { ActivityType.AnswerAccepted, 25 },
            { ActivityType.QuestionClosed, 0 },
            { ActivityType.ContentModerated, -50 },
            { ActivityType.BadgeEarned, 0 },
            { ActivityType.ExpertiseAreaAdded, 10 }
        };

        // Reputation requirements for privileges
        private static readonly Dictionary<string, int> PrivilegeRequirements = new()
        {
            { "Downvote", 125 },
            { "Comment", 50 },
            { "EditOthers", 2000 },
            { "CloseQuestions", 3000 },
            { "Moderate", 10000 }
        };

        // Badge milestone thresholds
        private static readonly Dictionary<BadgeType, int> BadgeMilestones = new()
        {
            { BadgeType.Reputation100, 100 },
            { BadgeType.Reputation500, 500 },
            { BadgeType.Reputation1000, 1000 },
            { BadgeType.Reputation2500, 2500 },
            { BadgeType.Reputation5000, 5000 },
            { BadgeType.Reputation10000, 10000 },
            { BadgeType.FirstAnswer, 1 },
            { BadgeType.FirstAcceptedAnswer, 1 },
            { BadgeType.TenAcceptedAnswers, 10 },
            { BadgeType.FiftyAcceptedAnswers, 50 },
            { BadgeType.HundredAcceptedAnswers, 100 }
        };

        public ReputationDomainService(
            IRepository<UserReputation> userReputationRepository,
            IRepository<QAUserActivity> activityRepository,
            ILogger<ReputationDomainService> logger)
        {
            _userReputationRepository = userReputationRepository;
            _activityRepository = activityRepository;
            _logger = logger;
        }

        public async Task<int> CalculateReputationChangeAsync(
            ActivityType activityType, 
            Guid userId, 
            Guid? contentId = null, 
            string? category = null, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var basePoints = ReputationPoints.GetValueOrDefault(activityType, 0);
                
                // Apply category-specific bonuses for experts
                if (!string.IsNullOrEmpty(category) && basePoints > 0)
                {
                    var isExpert = await IsUserExpertInCategoryAsync(userId, category, cancellationToken);
                    if (isExpert)
                    {
                        basePoints = (int)(basePoints * 1.2); // 20% bonus for experts
                    }
                }

                _logger.LogDebug("Calculated reputation change for user {UserId}, activity {ActivityType}: {Points}",
                    userId, activityType, basePoints);

                return basePoints;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating reputation change for user {UserId}, activity {ActivityType}",
                    userId, activityType);
                return 0;
            }
        }

        public async Task<UserReputation> UpdateUserReputationAsync(
            Guid userId, 
            ReputationChange reputationChange, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                
                // Update reputation score (minimum 0)
                var oldScore = userReputation.ReputationScore;
                userReputation.ReputationScore = Math.Max(0, userReputation.ReputationScore + reputationChange.Points);
                userReputation.LastUpdated = DateTime.UtcNow;

                // Update activity counters based on reputation change reason
                UpdateActivityCounters(userReputation, reputationChange.Reason);

                await _userReputationRepository.UpdateAsync(userReputation);

                // Record the activity
                await RecordActivityAsync(
                    userId, 
                    GetActivityTypeFromReason(reputationChange.Reason), 
                    reputationChange.ContentId ?? Guid.NewGuid(), 
                    reputationChange.Category, 
                    reputationChange.Points, 
                    cancellationToken);

                _logger.LogInformation("Reputation updated for user {UserId}. Change: {Change}, Old Score: {OldScore}, New Score: {NewScore}",
                    userId, reputationChange.Points, oldScore, userReputation.ReputationScore);

                return userReputation;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating reputation for user {UserId}", userId);
                throw;
            }
        }

        public async Task<UserReputation> RecalculateUserReputationAsync(
            Guid userId, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                var activities = await GetReputationHistoryAsync(userId, cancellationToken: cancellationToken);

                // Recalculate total reputation from all activities
                var totalReputation = activities.Sum(a => a.ReputationChange);
                userReputation.ReputationScore = Math.Max(0, totalReputation);

                // Recalculate activity counters
                userReputation.QuestionsAsked = activities.Count(a => a.ActivityType == ActivityType.QuestionAsked.ToString());
                userReputation.AnswersGiven = activities.Count(a => a.ActivityType == ActivityType.AnswerGiven.ToString());
                userReputation.AcceptedAnswers = activities.Count(a => a.ActivityType == ActivityType.AnswerAccepted.ToString());

                userReputation.LastUpdated = DateTime.UtcNow;
                await _userReputationRepository.UpdateAsync(userReputation);

                _logger.LogInformation("Recalculated reputation for user {UserId}. New Score: {Score}", 
                    userId, userReputation.ReputationScore);

                return userReputation;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recalculating reputation for user {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<Badge>> CheckForNewBadgesAsync(
            Guid userId, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                var currentBadges = await GetUserBadgesAsync(userId, cancellationToken);
                var currentBadgeTypes = currentBadges.Select(b => b.Type).ToHashSet();
                var newBadges = new List<Badge>();

                // Check reputation milestone badges
                foreach (var milestone in BadgeMilestones.Where(m => m.Key.ToString().StartsWith("Reputation")))
                {
                    if (userReputation.ReputationScore >= milestone.Value && !currentBadgeTypes.Contains(milestone.Key))
                    {
                        newBadges.Add(Badge.CreateReputationMilestoneBadge(milestone.Value));
                    }
                }

                // Check answer milestone badges
                if (userReputation.AnswersGiven >= 1 && !currentBadgeTypes.Contains(BadgeType.FirstAnswer))
                {
                    newBadges.Add(new Badge(BadgeType.FirstAnswer, "First Answer", "Posted your first answer", "/badges/first-answer.svg"));
                }

                if (userReputation.AcceptedAnswers >= 1 && !currentBadgeTypes.Contains(BadgeType.FirstAcceptedAnswer))
                {
                    newBadges.Add(new Badge(BadgeType.FirstAcceptedAnswer, "First Accepted Answer", "Had your first answer accepted", "/badges/first-accepted.svg"));
                }

                if (userReputation.AcceptedAnswers >= 10 && !currentBadgeTypes.Contains(BadgeType.TenAcceptedAnswers))
                {
                    newBadges.Add(new Badge(BadgeType.TenAcceptedAnswers, "Ten Accepted Answers", "Had ten answers accepted", "/badges/ten-accepted.svg"));
                }

                // Check quality badges based on vote ratios
                var upvoteRatio = userReputation.UpvotesReceived > 0 ? 
                    (double)userReputation.UpvotesReceived / (userReputation.UpvotesReceived + userReputation.DownvotesReceived) : 0;

                if (upvoteRatio >= 0.8 && userReputation.UpvotesReceived >= 10 && !currentBadgeTypes.Contains(BadgeType.Helpful))
                {
                    newBadges.Add(Badge.CreateHelpfulBadge());
                }

                if (upvoteRatio >= 0.9 && userReputation.UpvotesReceived >= 25 && !currentBadgeTypes.Contains(BadgeType.Knowledgeable))
                {
                    newBadges.Add(Badge.CreateKnowledgeableBadge("General"));
                }

                _logger.LogDebug("Found {Count} new badges for user {UserId}", newBadges.Count, userId);
                return newBadges;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking for new badges for user {UserId}", userId);
                return Enumerable.Empty<Badge>();
            }
        }

        public async Task<UserReputation> AwardBadgeAsync(
            Guid userId, 
            Badge badge, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                var currentBadges = await GetUserBadgesAsync(userId, cancellationToken);
                
                // Check if user already has this badge
                if (currentBadges.Any(b => b.Type == badge.Type && b.Category == badge.Category))
                {
                    _logger.LogWarning("User {UserId} already has badge {BadgeType} in category {Category}", 
                        userId, badge.Type, badge.Category);
                    return userReputation;
                }

                // Add badge to user's collection
                var badges = currentBadges.ToList();
                badges.Add(badge);
                userReputation.BadgesEarned = JsonSerializer.Serialize(badges);
                userReputation.LastUpdated = DateTime.UtcNow;

                await _userReputationRepository.UpdateAsync(userReputation);

                // Record badge earning activity
                await RecordActivityAsync(
                    userId, 
                    ActivityType.BadgeEarned, 
                    Guid.NewGuid(), 
                    badge.Category, 
                    0, 
                    cancellationToken);

                _logger.LogInformation("Awarded badge {BadgeType} to user {UserId}", badge.Type, userId);
                return userReputation;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error awarding badge {BadgeType} to user {UserId}", badge.Type, userId);
                throw;
            }
        }

        public async Task<bool> HasBadgeAsync(
            Guid userId, 
            BadgeType badgeType, 
            string? category = null, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var badges = await GetUserBadgesAsync(userId, cancellationToken);
                return badges.Any(b => b.Type == badgeType && (category == null || b.Category == category));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking badge {BadgeType} for user {UserId}", badgeType, userId);
                return false;
            }
        }

        public async Task<IEnumerable<Badge>> GetUserBadgesAsync(
            Guid userId, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                
                if (string.IsNullOrEmpty(userReputation.BadgesEarned))
                {
                    return Enumerable.Empty<Badge>();
                }

                var badges = JsonSerializer.Deserialize<List<Badge>>(userReputation.BadgesEarned) ?? new List<Badge>();
                return badges;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting badges for user {UserId}", userId);
                return Enumerable.Empty<Badge>();
            }
        }

        public async Task<QAUserActivity> RecordActivityAsync(
            Guid userId, 
            ActivityType activityType, 
            Guid contentId, 
            string? category = null, 
            int reputationChange = 0, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var activity = new QAUserActivity
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ActivityType = activityType.ToString(),
                    ContentId = contentId,
                    Category = category,
                    ReputationChange = reputationChange,
                    CreatedAt = DateTime.UtcNow
                };

                await _activityRepository.AddAsync(activity);
                
                _logger.LogDebug("Recorded activity {ActivityType} for user {UserId} with reputation change {Change}",
                    activityType, userId, reputationChange);

                return activity;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording activity {ActivityType} for user {UserId}", activityType, userId);
                throw;
            }
        }

        public async Task<IEnumerable<QAUserActivity>> GetReputationHistoryAsync(
            Guid userId, 
            DateTime? fromDate = null, 
            DateTime? toDate = null, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var query = await _activityRepository.GetAllAsync();
                var activities = query.Where(a => a.UserId == userId);

                if (fromDate.HasValue)
                {
                    activities = activities.Where(a => a.CreatedAt >= fromDate.Value);
                }

                if (toDate.HasValue)
                {
                    activities = activities.Where(a => a.CreatedAt <= toDate.Value);
                }

                return activities.OrderByDescending(a => a.CreatedAt).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reputation history for user {UserId}", userId);
                return Enumerable.Empty<QAUserActivity>();
            }
        }

        public async Task<Dictionary<string, int>> GetReputationBreakdownAsync(
            Guid userId, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var activities = await GetReputationHistoryAsync(userId, cancellationToken: cancellationToken);
                
                return activities
                    .GroupBy(a => a.ActivityType)
                    .ToDictionary(g => g.Key, g => g.Sum(a => a.ReputationChange));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reputation breakdown for user {UserId}", userId);
                return new Dictionary<string, int>();
            }
        }

        // Expertise Area Management methods will be implemented in the next part...
        // (Continuing in next message due to length)
        
        private async Task<UserReputation> GetOrCreateUserReputationAsync(Guid userId, CancellationToken cancellationToken)
        {
            var userReputation = (await _userReputationRepository.GetAllAsync())
                .FirstOrDefault(ur => ur.UserId == userId);

            if (userReputation == null)
            {
                userReputation = new UserReputation
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ReputationScore = 0,
                    CreatedAt = DateTime.UtcNow
                };
                await _userReputationRepository.AddAsync(userReputation);
            }

            return userReputation;
        }

        private static void UpdateActivityCounters(UserReputation userReputation, ReputationChangeReason reason)
        {
            switch (reason)
            {
                case ReputationChangeReason.AnswerUpvoted:
                case ReputationChangeReason.QuestionUpvoted:
                    userReputation.UpvotesReceived++;
                    break;
                case ReputationChangeReason.AnswerDownvoted:
                case ReputationChangeReason.QuestionDownvoted:
                    userReputation.DownvotesReceived++;
                    break;
                case ReputationChangeReason.AnswerAccepted:
                    userReputation.AcceptedAnswers++;
                    break;
            }
        }

        private static ActivityType GetActivityTypeFromReason(ReputationChangeReason reason)
        {
            return reason switch
            {
                ReputationChangeReason.AnswerUpvoted or ReputationChangeReason.AnswerDownvoted => ActivityType.VoteCast,
                ReputationChangeReason.QuestionUpvoted or ReputationChangeReason.QuestionDownvoted => ActivityType.VoteCast,
                ReputationChangeReason.AnswerAccepted => ActivityType.AnswerAccepted,
                ReputationChangeReason.ContentRemoved or ReputationChangeReason.SpamPenalty or ReputationChangeReason.ModerationPenalty => ActivityType.ContentModerated,
                _ => ActivityType.VoteCast
            };
        }

        // Expertise Area Management
        public async Task<UserReputation> AddExpertiseAreaAsync(
            Guid userId, 
            ExpertiseArea expertiseArea, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                var expertiseAreas = (await GetUserExpertiseAreasAsync(userId, cancellationToken)).ToList();

                // Check if expertise area already exists
                if (expertiseAreas.Any(ea => ea.Category == expertiseArea.Category))
                {
                    _logger.LogWarning("User {UserId} already has expertise area {Category}", userId, expertiseArea.Category);
                    return userReputation;
                }

                expertiseAreas.Add(expertiseArea);
                userReputation.ExpertiseAreas = JsonSerializer.Serialize(expertiseAreas);
                userReputation.LastUpdated = DateTime.UtcNow;

                await _userReputationRepository.UpdateAsync(userReputation);

                // Record activity
                await RecordActivityAsync(
                    userId, 
                    ActivityType.ExpertiseAreaAdded, 
                    Guid.NewGuid(), 
                    expertiseArea.Category, 
                    10, 
                    cancellationToken);

                _logger.LogInformation("Added expertise area {Category} for user {UserId}", expertiseArea.Category, userId);
                return userReputation;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding expertise area {Category} for user {UserId}", expertiseArea.Category, userId);
                throw;
            }
        }

        public async Task<UserReputation> UpdateExpertiseAreaAsync(
            Guid userId, 
            string category, 
            int answerCount, 
            int acceptedAnswerCount, 
            decimal averageRating, 
            decimal responseRate, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                var expertiseAreas = (await GetUserExpertiseAreasAsync(userId, cancellationToken)).ToList();

                var existingArea = expertiseAreas.FirstOrDefault(ea => ea.Category == category);
                if (existingArea == null)
                {
                    // Create new expertise area if it doesn't exist
                    var newArea = new ExpertiseArea(category, category, answerCount, acceptedAnswerCount, averageRating, responseRate);
                    expertiseAreas.Add(newArea);
                }
                else
                {
                    // Update existing expertise area
                    var updatedArea = existingArea.UpdateStats(answerCount, acceptedAnswerCount, averageRating, responseRate);
                    var index = expertiseAreas.IndexOf(existingArea);
                    expertiseAreas[index] = updatedArea;
                }

                userReputation.ExpertiseAreas = JsonSerializer.Serialize(expertiseAreas);
                userReputation.LastUpdated = DateTime.UtcNow;

                await _userReputationRepository.UpdateAsync(userReputation);

                _logger.LogDebug("Updated expertise area {Category} for user {UserId}", category, userId);
                return userReputation;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating expertise area {Category} for user {UserId}", category, userId);
                throw;
            }
        }

        public async Task<UserReputation> RemoveExpertiseAreaAsync(
            Guid userId, 
            string category, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                var expertiseAreas = (await GetUserExpertiseAreasAsync(userId, cancellationToken)).ToList();

                var areaToRemove = expertiseAreas.FirstOrDefault(ea => ea.Category == category);
                if (areaToRemove != null)
                {
                    expertiseAreas.Remove(areaToRemove);
                    userReputation.ExpertiseAreas = JsonSerializer.Serialize(expertiseAreas);
                    userReputation.LastUpdated = DateTime.UtcNow;

                    await _userReputationRepository.UpdateAsync(userReputation);

                    _logger.LogInformation("Removed expertise area {Category} for user {UserId}", category, userId);
                }

                return userReputation;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing expertise area {Category} for user {UserId}", category, userId);
                throw;
            }
        }

        public async Task<IEnumerable<ExpertiseArea>> GetUserExpertiseAreasAsync(
            Guid userId, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                
                if (string.IsNullOrEmpty(userReputation.ExpertiseAreas))
                {
                    return Enumerable.Empty<ExpertiseArea>();
                }

                var expertiseAreas = JsonSerializer.Deserialize<List<ExpertiseArea>>(userReputation.ExpertiseAreas) ?? new List<ExpertiseArea>();
                return expertiseAreas;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting expertise areas for user {UserId}", userId);
                return Enumerable.Empty<ExpertiseArea>();
            }
        }

        public async Task<bool> IsUserExpertInCategoryAsync(
            Guid userId, 
            string category, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var expertiseAreas = await GetUserExpertiseAreasAsync(userId, cancellationToken);
                var expertiseArea = expertiseAreas.FirstOrDefault(ea => ea.Category == category);
                
                return expertiseArea?.IsExpertLevel == true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking expert status for user {UserId} in category {Category}", userId, category);
                return false;
            }
        }

        // Privilege Management
        public async Task<bool> CanUserDownvoteAsync(
            Guid userId, 
            CancellationToken cancellationToken = default)
        {
            return await HasSufficientReputationAsync(userId, "Downvote", cancellationToken);
        }

        public async Task<bool> CanUserModerateAsync(
            Guid userId, 
            CancellationToken cancellationToken = default)
        {
            return await HasSufficientReputationAsync(userId, "Moderate", cancellationToken);
        }

        public async Task<bool> CanUserEditOthersContentAsync(
            Guid userId, 
            CancellationToken cancellationToken = default)
        {
            return await HasSufficientReputationAsync(userId, "EditOthers", cancellationToken);
        }

        public async Task<bool> CanUserCloseQuestionsAsync(
            Guid userId, 
            CancellationToken cancellationToken = default)
        {
            return await HasSufficientReputationAsync(userId, "CloseQuestions", cancellationToken);
        }

        public async Task<int> GetRequiredReputationForPrivilegeAsync(
            string privilegeName, 
            CancellationToken cancellationToken = default)
        {
            await Task.CompletedTask;
            return PrivilegeRequirements.GetValueOrDefault(privilegeName, 0);
        }

        // Analytics and Insights
        public async Task<Dictionary<string, object>> GetReputationAnalyticsAsync(
            Guid userId, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                var activities = await GetReputationHistoryAsync(userId, cancellationToken: cancellationToken);
                var expertiseAreas = await GetUserExpertiseAreasAsync(userId, cancellationToken);
                var badges = await GetUserBadgesAsync(userId, cancellationToken);

                var analytics = new Dictionary<string, object>
                {
                    ["TotalReputation"] = userReputation.ReputationScore,
                    ["QuestionsAsked"] = userReputation.QuestionsAsked,
                    ["AnswersGiven"] = userReputation.AnswersGiven,
                    ["AcceptedAnswers"] = userReputation.AcceptedAnswers,
                    ["UpvotesReceived"] = userReputation.UpvotesReceived,
                    ["DownvotesReceived"] = userReputation.DownvotesReceived,
                    ["BadgeCount"] = badges.Count(),
                    ["ExpertiseAreaCount"] = expertiseAreas.Count(),
                    ["AcceptanceRate"] = userReputation.AnswersGiven > 0 ? 
                        (decimal)userReputation.AcceptedAnswers / userReputation.AnswersGiven * 100 : 0,
                    ["UpvoteRatio"] = userReputation.UpvotesReceived + userReputation.DownvotesReceived > 0 ?
                        (decimal)userReputation.UpvotesReceived / (userReputation.UpvotesReceived + userReputation.DownvotesReceived) * 100 : 0,
                    ["RecentActivity"] = activities.Take(10).ToList(),
                    ["TopCategories"] = activities.Where(a => !string.IsNullOrEmpty(a.Category))
                        .GroupBy(a => a.Category)
                        .OrderByDescending(g => g.Sum(a => a.ReputationChange))
                        .Take(5)
                        .ToDictionary(g => g.Key!, g => g.Sum(a => a.ReputationChange))
                };

                return analytics;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reputation analytics for user {UserId}", userId);
                return new Dictionary<string, object>();
            }
        }

        public async Task<IEnumerable<UserReputation>> GetTopUsersAsync(
            int count = 10, 
            string? category = null, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var allUsers = await _userReputationRepository.GetAllAsync();
                var topUsers = allUsers.OrderByDescending(ur => ur.ReputationScore).Take(count);

                if (!string.IsNullOrEmpty(category))
                {
                    // Filter by users who have expertise in the specified category
                    topUsers = topUsers.Where(ur => 
                        !string.IsNullOrEmpty(ur.ExpertiseAreas) && 
                        ur.ExpertiseAreas.Contains($"\"{category}\""));
                }

                return topUsers.ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting top users");
                return Enumerable.Empty<UserReputation>();
            }
        }

        public async Task<IEnumerable<UserReputation>> GetExpertsInCategoryAsync(
            string category, 
            int count = 10, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var allUsers = await _userReputationRepository.GetAllAsync();
                var experts = new List<UserReputation>();

                foreach (var user in allUsers)
                {
                    if (await IsUserExpertInCategoryAsync(user.UserId, category, cancellationToken))
                    {
                        experts.Add(user);
                    }
                }

                return experts.OrderByDescending(ur => ur.ReputationScore).Take(count).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting experts in category {Category}", category);
                return Enumerable.Empty<UserReputation>();
            }
        }

        public async Task<decimal> GetUserReputationPercentileAsync(
            Guid userId, 
            CancellationToken cancellationToken = default)
        {
            try
            {
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                var allUsers = await _userReputationRepository.GetAllAsync();
                var totalUsers = allUsers.Count();
                
                if (totalUsers == 0) return 0;

                var usersWithLowerReputation = allUsers.Count(ur => ur.ReputationScore < userReputation.ReputationScore);
                return (decimal)usersWithLowerReputation / totalUsers * 100;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating reputation percentile for user {UserId}", userId);
                return 0;
            }
        }

        // Helper method for privilege checking
        private async Task<bool> HasSufficientReputationAsync(
            Guid userId, 
            string privilegeName, 
            CancellationToken cancellationToken)
        {
            try
            {
                var requiredReputation = PrivilegeRequirements.GetValueOrDefault(privilegeName, 0);
                var userReputation = await GetOrCreateUserReputationAsync(userId, cancellationToken);
                
                return userReputation.ReputationScore >= requiredReputation;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking privilege {Privilege} for user {UserId}", privilegeName, userId);
                return false;
            }
        }
    }
}