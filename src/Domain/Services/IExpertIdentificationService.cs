using Domain.Entities.Community.QA;
using Domain.ValueObjects.Community;

namespace Domain.Services
{
    /// <summary>
    /// Domain service for expert identification and ranking algorithms
    /// </summary>
    public interface IExpertIdentificationService
    {
        /// <summary>
        /// Identifies potential experts in a category based on performance metrics
        /// </summary>
        Task<List<Guid>> IdentifyPotentialExpertsAsync(string category, int minimumAnswers = 5);

        /// <summary>
        /// Calculates expert score based on multiple factors
        /// </summary>
        Task<decimal> CalculateExpertScoreAsync(Guid userId, string category);

        /// <summary>
        /// Determines if a user qualifies for expert promotion
        /// </summary>
        Task<bool> QualifiesForExpertPromotionAsync(Guid userId, string category);

        /// <summary>
        /// Ranks experts in a category by their performance and activity
        /// </summary>
        Task<List<ExpertRanking>> RankExpertsInCategoryAsync(string category);

        /// <summary>
        /// Calculates expertise level based on performance metrics
        /// </summary>
        ExpertiseLevel DetermineExpertiseLevel(
            int acceptedAnswers, 
            decimal averageRating, 
            decimal responseRate, 
            int reputationScore, 
            int totalAnswers);

        /// <summary>
        /// Calculates response rate for expert notifications
        /// </summary>
        Task<decimal> CalculateExpertResponseRateAsync(Guid userId, string category, DateTime? fromDate = null);

        /// <summary>
        /// Identifies trending experts based on recent activity
        /// </summary>
        Task<List<Guid>> IdentifyTrendingExpertsAsync(string category, TimeSpan timeWindow);

        /// <summary>
        /// Calculates expert influence score based on answer impact
        /// </summary>
        Task<decimal> CalculateInfluenceScoreAsync(Guid userId, string category);
    }

    /// <summary>
    /// Expert ranking result
    /// </summary>
    public class ExpertRanking
    {
        public Guid UserId { get; set; }
        public string Category { get; set; } = string.Empty;
        public decimal ExpertScore { get; set; }
        public ExpertiseLevel Level { get; set; }
        public int Rank { get; set; }
        public decimal ResponseRate { get; set; }
        public decimal AverageRating { get; set; }
        public int AcceptedAnswers { get; set; }
        public decimal InfluenceScore { get; set; }
        public DateTime LastActivity { get; set; }
    }

    /// <summary>
    /// Expertise levels with clear progression
    /// </summary>
    public enum ExpertiseLevel
    {
        Beginner = 1,
        Intermediate = 2,
        Expert = 3,
        Master = 4
    }
}