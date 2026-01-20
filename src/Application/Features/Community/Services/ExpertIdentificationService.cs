using Application.Common.Interfaces;
using Domain.Enums.Community;
using Domain.Services;
using Domain.Entities.Community.QA;
using Microsoft.Extensions.Logging;

namespace Application.Features.Community.Services
{
    public class ExpertIdentificationService : IExpertIdentificationService
    {
        private readonly IRepository<Expert> _expertRepository;
        private readonly IRepository<Answer> _answerRepository;
        private readonly IRepository<UserReputation> _reputationRepository;
        private readonly ILogger<ExpertIdentificationService> _logger;

        public ExpertIdentificationService(
            IRepository<Expert> expertRepository,
            IRepository<Answer> answerRepository,
            IRepository<UserReputation> reputationRepository,
            ILogger<ExpertIdentificationService> logger)
        {
            _expertRepository = expertRepository;
            _answerRepository = answerRepository;
            _reputationRepository = reputationRepository;
            _logger = logger;
        }

        public async Task<List<ExpertRanking>> RankExpertsInCategoryAsync(string category)
        {
            try
            {
                var experts = await _expertRepository.GetAllAsync();
                var categoryExperts = experts.Where(e => e.Category.Name.Equals(category, StringComparison.OrdinalIgnoreCase)).ToList();

                var rankings = new List<ExpertRanking>();

                foreach (var expert in categoryExperts)
                {
                    var expertScore = await CalculateExpertScoreAsync(expert.UserId, category);
                    var level = DetermineExpertiseLevel(
                        expert.AcceptedAnswerCount,
                        expert.AverageRating,
                        expert.ResponseRate,
                        0, // Will be filled from reputation
                        expert.AnswerCount);

                    rankings.Add(new ExpertRanking
                    {
                        UserId = expert.UserId,
                        Category = category,
                        Level = level,
                        AcceptedAnswers = expert.AcceptedAnswerCount,
                        AverageRating = expert.AverageRating,
                        ResponseRate = expert.ResponseRate,
                        ExpertScore = expertScore
                    });
                }

                return rankings.OrderByDescending(r => r.ExpertScore).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ranking experts in category {Category}", category);
                return new List<ExpertRanking>();
            }
        }

        public ExpertiseLevel DetermineExpertiseLevel(int acceptedAnswers, decimal averageRating, decimal responseRate, int reputationScore, int totalAnswers)
        {
            try
            {
                var score = CalculateExpertiseScore(acceptedAnswers, averageRating, responseRate, reputationScore, totalAnswers);

                return score switch
                {
                    >= 90 => ExpertiseLevel.Master,
                    >= 70 => ExpertiseLevel.Expert,
                    >= 40 => ExpertiseLevel.Advanced,
                    >= 20 => ExpertiseLevel.Intermediate,
                    _ => ExpertiseLevel.Beginner
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error determining expertise level");
                return ExpertiseLevel.Beginner;
            }
        }

        public async Task<bool> ShouldPromoteToExpertAsync(Guid userId, string category)
        {
            try
            {
                var expertScore = await CalculateExpertScoreAsync(userId, category);
                return expertScore >= 70; // Expert threshold
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if user {UserId} should be promoted to expert in {Category}", userId, category);
                return false;
            }
        }

        public async Task<decimal> CalculateExpertScoreAsync(Guid userId, string category)
        {
            try
            {
                var answers = await _answerRepository.GetAllAsync();
                var userAnswers = answers.Where(a => a.UserId == userId && !a.IsDeleted).ToList();
                
                var reputations = await _reputationRepository.GetAllAsync();
                var userReputation = reputations.FirstOrDefault(r => r.UserId == userId);

                var acceptedAnswers = userAnswers.Count(a => a.IsAccepted);
                var averageRating = userAnswers.Any() ? (decimal)userAnswers.Average(a => a.UpvotesCount - a.DownvotesCount) : 0;
                var responseRate = 85.0m; // Placeholder - would need to calculate from actual response data
                var reputationScore = userReputation?.ReputationScore ?? 0;
                var totalAnswers = userAnswers.Count;

                return CalculateExpertiseScore(acceptedAnswers, averageRating, responseRate, reputationScore, totalAnswers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating expert score for user {UserId} in category {Category}", userId, category);
                return 0;
            }
        }

        private decimal CalculateExpertiseScore(int acceptedAnswers, decimal averageRating, decimal responseRate, int reputationScore, int totalAnswers)
        {
            // Weighted scoring algorithm
            var acceptanceWeight = 0.3m;
            var ratingWeight = 0.25m;
            var responseWeight = 0.2m;
            var reputationWeight = 0.15m;
            var volumeWeight = 0.1m;

            // Normalize scores to 0-100 scale
            var acceptanceScore = totalAnswers > 0 ? (decimal)acceptedAnswers / totalAnswers * 100 : 0;
            var ratingScore = Math.Max(0, Math.Min(100, (averageRating + 5) * 10)); // Normalize -5 to +5 rating to 0-100
            var responseScore = Math.Max(0, Math.Min(100, responseRate));
            var reputationScoreNormalized = Math.Max(0, Math.Min(100, reputationScore / 100m)); // Assuming max reputation of 10000
            var volumeScore = Math.Max(0, Math.Min(100, totalAnswers * 2)); // 50 answers = 100 points

            var totalScore = (acceptanceScore * acceptanceWeight) +
                           (ratingScore * ratingWeight) +
                           (responseScore * responseWeight) +
                           (reputationScoreNormalized * reputationWeight) +
                           (volumeScore * volumeWeight);

            return Math.Max(0, Math.Min(100, totalScore));
        }
    }
}
