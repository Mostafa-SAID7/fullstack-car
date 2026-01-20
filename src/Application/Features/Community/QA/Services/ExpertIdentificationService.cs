using Application.Common.Interfaces;
using Domain.Services;
using Domain.Enums.Community;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Community.QA.Services;

public class ExpertIdentificationService : IExpertIdentificationService
{
    private readonly IApplicationDbContext _context;
    private readonly ILogger<ExpertIdentificationService> _logger;

    public ExpertIdentificationService(
        IApplicationDbContext context,
        ILogger<ExpertIdentificationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<bool> IsExpertInCategoryAsync(Guid userId, string category)
    {
        try
        {
            var expert = await _context.Experts
                .FirstOrDefaultAsync(e => e.UserId == userId && e.ExpertiseArea == category);
            
            return expert != null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if user {UserId} is expert in {Category}", userId, category);
            return false;
        }
    }

    public async Task<List<Guid>> GetExpertsForCategoryAsync(string category)
    {
        try
        {
            var expertIds = await _context.Experts
                .Where(e => e.ExpertiseArea == category)
                .Select(e => e.UserId)
                .ToListAsync();
            
            return expertIds;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting experts for category {Category}", category);
            return new List<Guid>();
        }
    }

    public async Task<double> CalculateExpertiseScoreAsync(Guid userId, string category)
    {
        try
        {
            // Calculate expertise score based on answers, reputation, etc.
            var userReputation = await _context.UserReputations
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.ReputationScore)
                .FirstOrDefaultAsync();

            var answersInCategory = await _context.Answers
                .Where(a => a.UserId == userId && a.Question.Category != null && a.Question.Category.Name == category)
                .CountAsync();

            // Simple scoring algorithm
            var score = (userReputation * 0.6) + (answersInCategory * 10);
            return Math.Min(score / 1000.0, 1.0); // Normalize to 0-1
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating expertise score for user {UserId} in {Category}", userId, category);
            return 0.0;
        }
    }

    public async Task<List<ExpertRanking>> RankExpertsInCategoryAsync(string category)
    {
        try
        {
            var experts = await _context.Experts
                .Where(e => e.ExpertiseArea == category)
                .ToListAsync();

            var rankings = new List<ExpertRanking>();

            foreach (var expert in experts)
            {
                var score = await CalculateExpertScoreAsync(expert.UserId, category);
                var acceptedAnswers = await _context.Answers
                    .Where(a => a.UserId == expert.UserId && a.IsAccepted)
                    .CountAsync();

                rankings.Add(new ExpertRanking
                {
                    UserId = expert.UserId,
                    Category = category,
                    Level = DetermineExpertiseLevel(acceptedAnswers, 4.5m, 0.8m, 1000, 50),
                    AcceptedAnswers = acceptedAnswers,
                    AverageRating = 4.5m,
                    ResponseRate = 0.8m,
                    ExpertScore = (decimal)score
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
        var score = (acceptedAnswers * 10) + (int)(averageRating * 20) + (int)(responseRate * 30) + (reputationScore / 10) + (totalAnswers * 2);

        return score switch
        {
            >= 1000 => ExpertiseLevel.Expert,
            >= 500 => ExpertiseLevel.Advanced,
            >= 200 => ExpertiseLevel.Intermediate,
            >= 50 => ExpertiseLevel.Beginner,
            _ => ExpertiseLevel.Novice
        };
    }

    public async Task<bool> ShouldPromoteToExpertAsync(Guid userId, string category)
    {
        try
        {
            var score = await CalculateExpertiseScoreAsync(userId, category);
            return score >= 0.8; // 80% threshold for expert promotion
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if user {UserId} should be promoted to expert in {Category}", userId, category);
            return false;
        }
    }

    public async Task<decimal> CalculateExpertScoreAsync(Guid userId, string category)
    {
        var score = await CalculateExpertiseScoreAsync(userId, category);
        return (decimal)score;
    }
}