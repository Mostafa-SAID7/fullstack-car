using Domain.Entities.Community.QA;
using Domain.ValueObjects.Community;

namespace Domain.Services
{
    public interface IExpertIdentificationService
    {
        Task<List<Guid>> IdentifyPotentialExpertsAsync(string category, int minimumAnswers = 5);
        Task<decimal> CalculateExpertScoreAsync(Guid userId, string category);
        Task<bool> QualifiesForExpertPromotionAsync(Guid userId, string category);
        Task<List<ExpertRanking>> RankExpertsInCategoryAsync(string category);
        ExpertiseLevel DetermineExpertiseLevel(
            int acceptedAnswers, 
            decimal averageRating, 
            decimal responseRate, 
            int reputationScore, 
            int totalAnswers);
        Task<decimal> CalculateExpertResponseRateAsync(Guid userId, string category, DateTime? fromDate = null);
        Task<List<Guid>> IdentifyTrendingExpertsAsync(string category, TimeSpan timeWindow);
        Task<decimal> CalculateInfluenceScoreAsync(Guid userId, string category);
    }
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
    public enum ExpertiseLevel
    {
        Beginner = 1,
        Intermediate = 2,
        Expert = 3,
        Master = 4
    }
}