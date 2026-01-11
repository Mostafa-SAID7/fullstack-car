using Domain.Entities.Community.QA;
using Domain.Interfaces;
using Domain.ValueObjects.Community;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Domain.Services
{
    /// <summary>
    /// Domain service for expert identification and ranking algorithms
    /// </summary>
    public class ExpertIdentificationService : IExpertIdentificationService
    {
        private readonly IRepository<QAExpert> _expertRepository;
        private readonly IRepository<UserReputation> _reputationRepository;
        private readonly IRepository<Answer> _answerRepository;
        private readonly ILogger<ExpertIdentificationService> _logger;

        public ExpertIdentificationService(
            IRepository<QAExpert> expertRepository,
            IRepository<UserReputation> reputationRepository,
            IRepository<Answer> answerRepository,
            ILogger<ExpertIdentificationService> logger)
        {
            _expertRepository = expertRepository;
            _reputationRepository = reputationRepository;
            _answerRepository = answerRepository;
            _logger = logger;
        }

        public async Task<List<Guid>> IdentifyPotentialExpertsAsync(string category, int minimumAnswers = 5)
        {
            try
            {
                var answers = await _answerRepository.GetAllAsync();
                var userAnswerCounts = answers
                    .Where(a => !a.IsDeleted)
                    .GroupBy(a => a.UserId)
                    .Where(g => g.Count() >= minimumAnswers)
                    .Select(g => g.Key)
                    .ToList();

                return userAnswerCounts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error identifying potential experts for category {Category}", category);
                return new List<Guid>();
            }
        }

        public async Task<decimal> CalculateExpertScoreAsync(Guid userId, string category)
        {
            try
            {
                var reputation = await _reputationRepository.GetAllAsync();
                var userReputation = reputation.FirstOrDefault(r => r.UserId == userId);
                
                if (userReputation == null) return 0;

                var answers = await _answerRepository.GetAllAsync();
                var userAnswers = answers.Where(a => a.UserId == userId && !a.IsDeleted).ToList();

                if (!userAnswers.Any()) return 0;

                var acceptedAnswers = userAnswers.Count(a => a.IsAccepted);
                var averageVotes = userAnswers.Any() ? userAnswers.Average(a => a.UpvotesCount - a.DownvotesCount) : 0;
                var responseRate = 85.0m; // Placeholder - would calculate from actual response data

                var score = (acceptedAnswers * 10) + ((decimal)averageVotes * 2) + (responseRate / 10) + (userReputation.ReputationScore / 100);
                return Math.Max(0, score);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating expert score for user {UserId} in category {Category}", userId, category);
                return 0;
            }
        }

        public async Task<bool> QualifiesForExpertPromotionAsync(Guid userId, string category)
        {
            try
            {
                var score = await CalculateExpertScoreAsync(userId, category);
                return score >= 50; // Threshold for expert promotion
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking expert qualification for user {UserId} in category {Category}", userId, category);
                return false;
            }
        }

        public async Task<List<ExpertRanking>> RankExpertsInCategoryAsync(string category)
        {
            try
            {
                var experts = await _expertRepository.GetAllAsync();
                var categoryExperts = experts.Where(e => e.Category.Name == category).ToList();

                var rankings = new List<ExpertRanking>();
                foreach (var expert in categoryExperts)
                {
                    var score = await CalculateExpertScoreAsync(expert.UserId, category);
                    rankings.Add(new ExpertRanking
                    {
                        UserId = expert.UserId,
                        Category = category,
                        ExpertScore = score,
                        Level = DetermineExpertiseLevel(expert.AcceptedAnswerCount, expert.AverageRating, expert.ResponseRate, 0, expert.AnswerCount),
                        ResponseRate = expert.ResponseRate,
                        AverageRating = expert.AverageRating,
                        AcceptedAnswers = expert.AcceptedAnswerCount,
                        InfluenceScore = await CalculateInfluenceScoreAsync(expert.UserId, category),
                        LastActivity = expert.UpdatedAt ?? expert.CreatedAt
                    });
                }

                return rankings.OrderByDescending(r => r.ExpertScore).Select((r, index) => { r.Rank = index + 1; return r; }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ranking experts in category {Category}", category);
                return new List<ExpertRanking>();
            }
        }

        public ExpertiseLevel DetermineExpertiseLevel(int acceptedAnswers, decimal averageRating, decimal responseRate, int reputationScore, int totalAnswers)
        {
            var score = (acceptedAnswers * 2) + (averageRating * 10) + (responseRate / 10) + (reputationScore / 100) + totalAnswers;

            return score switch
            {
                >= 100 => ExpertiseLevel.Master,
                >= 50 => ExpertiseLevel.Expert,
                >= 20 => ExpertiseLevel.Intermediate,
                _ => ExpertiseLevel.Beginner
            };
        }

        public async Task<decimal> CalculateExpertResponseRateAsync(Guid userId, string category, DateTime? fromDate = null)
        {
            try
            {
                // Placeholder implementation - would calculate from actual notification/response data
                var expert = await _expertRepository.GetAllAsync();
                var userExpert = expert.FirstOrDefault(e => e.UserId == userId);
                return userExpert?.ResponseRate ?? 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating response rate for user {UserId} in category {Category}", userId, category);
                return 0;
            }
        }

        public async Task<List<Guid>> IdentifyTrendingExpertsAsync(string category, TimeSpan timeWindow)
        {
            try
            {
                var cutoffDate = DateTime.UtcNow.Subtract(timeWindow);
                var answers = await _answerRepository.GetAllAsync();
                
                var trendingExperts = answers
                    .Where(a => a.CreatedAt >= cutoffDate && !a.IsDeleted)
                    .GroupBy(a => a.UserId)
                    .OrderByDescending(g => g.Count(a => a.IsAccepted))
                    .ThenByDescending(g => g.Sum(a => a.UpvotesCount - a.DownvotesCount))
                    .Take(10)
                    .Select(g => g.Key)
                    .ToList();

                return trendingExperts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error identifying trending experts in category {Category}", category);
                return new List<Guid>();
            }
        }

        public async Task<decimal> CalculateInfluenceScoreAsync(Guid userId, string category)
        {
            try
            {
                var answers = await _answerRepository.GetAllAsync();
                var userAnswers = answers.Where(a => a.UserId == userId && !a.IsDeleted).ToList();

                if (!userAnswers.Any()) return 0;

                var totalVotes = userAnswers.Sum(a => a.UpvotesCount - a.DownvotesCount);
                var acceptedAnswers = userAnswers.Count(a => a.IsAccepted);
                var influenceScore = (totalVotes * 0.5m) + (acceptedAnswers * 5);

                return Math.Max(0, influenceScore);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating influence score for user {UserId} in category {Category}", userId, category);
                return 0;
            }
        }
    }
}