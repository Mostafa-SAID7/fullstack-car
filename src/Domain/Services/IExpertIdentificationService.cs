using Domain.Enums.Community;

namespace Domain.Services
{
    public interface IExpertIdentificationService
    {
        Task<List<ExpertRanking>> RankExpertsInCategoryAsync(string category);
        ExpertiseLevel DetermineExpertiseLevel(int acceptedAnswers, decimal averageRating, decimal responseRate, int reputationScore, int totalAnswers);
        Task<bool> ShouldPromoteToExpertAsync(Guid userId, string category);
        Task<decimal> CalculateExpertScoreAsync(Guid userId, string category);
    }

    public class ExpertRanking
    {
        public Guid UserId { get; set; }
        public string Category { get; set; } = string.Empty;
        public ExpertiseLevel Level { get; set; }
        public int AcceptedAnswers { get; set; }
        public decimal AverageRating { get; set; }
        public decimal ResponseRate { get; set; }
        public decimal ExpertScore { get; set; }
    }
}