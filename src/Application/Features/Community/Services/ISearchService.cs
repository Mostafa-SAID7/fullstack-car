using Application.Common.Models;

namespace Application.Features.Community.Services;

public interface ISearchService
{
    Task<Result<List<Application.Features.Community.QA.DTOs.Responses.QuestionListDto>>> SearchQuestionsAsync(string query, int page = 1, int pageSize = 20);
    Task<Result<List<Application.Features.Community.QA.DTOs.Responses.AnswerDto>>> SearchAnswersAsync(string query, int page = 1, int pageSize = 20);
    Task<Result<List<string>>> GetSearchSuggestionsAsync(string query);
    Task<Result<bool>> IndexQuestionAsync(Guid questionId);
    Task<Result<bool>> IndexAnswerAsync(Guid answerId);
    Task<Result<bool>> RemoveFromIndexAsync(Guid contentId, string contentType);
    
    // Additional methods needed by handlers
    Task<Result<bool>> UpdateSearchIndexAsync(Guid contentId, string contentType, CancellationToken cancellationToken = default);
}