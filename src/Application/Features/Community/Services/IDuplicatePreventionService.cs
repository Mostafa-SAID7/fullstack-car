using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Responses;

namespace Application.Features.Community.Services;

public interface IDuplicatePreventionService
{
    Task<Result<List<Application.Features.Community.QA.DTOs.Responses.QuestionListDto>>> FindSimilarQuestionsAsync(string title, string content, string tags);
    Task<Result<bool>> IsDuplicateQuestionAsync(string title, string content, string tags);
    Task<Result<double>> CalculateSimilarityScoreAsync(string content1, string content2);
    Task<Result<List<string>>> GetDuplicatePreventionSuggestionsAsync(string title, string content);
    
    // Additional methods needed by handlers
    Task<Result<QuestionValidationResult>> ValidateQuestionForDuplicatesAsync(string title, string content, string category, List<string> tags, CancellationToken cancellationToken);
    Task<Result<List<SimilarQuestionResult>>> FindSimilarQuestionsAsync(string title, string content, string category, List<string> tags, Guid? excludeQuestionId, int maxResults, double minSimilarityScore, CancellationToken cancellationToken);
}