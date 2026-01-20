using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.Services;

public interface IUserSatisfactionService
{
    Task<Result<UserSatisfactionDto>> GetUserSatisfactionAsync();
    Task<Result<bool>> RecordFeedbackAsync(Guid userId, string category, double rating, string comments);
    Task<Result<FeedbackSummaryDto>> GetFeedbackSummaryAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<Result<bool>> TriggerSatisfactionSurveyAsync(Guid userId);
    Task<Result<List<UserSatisfactionDto>>> GetRecentFeedbackAsync(int count = 10);
}