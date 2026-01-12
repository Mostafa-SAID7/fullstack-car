using Application.Features.Community.QA.DTOs.Responses;
using Application.Features.Community.QA.Services;

namespace Infrastructure.Services.QA;

public class QAService : IQAService
{
    private readonly IQASearchService _searchService;
    private readonly IContentQualityService _contentQualityService;

    public QAService(IQASearchService searchService, IContentQualityService contentQualityService)
    {
        _searchService = searchService;
        _contentQualityService = contentQualityService;
    }

    public async Task<List<QuestionSimilarityDto>> FindSimilarQuestionsAsync(string title, string content, Guid? excludeQuestionId = null)
    {
        var result = await _searchService.FindSimilarQuestionsAsync(title, content, excludeQuestionId);
        return result.IsSuccess ? result.Data : new List<QuestionSimilarityDto>();
    }

    public async Task<bool> IsQuestionDuplicateAsync(string title, string content)
    {
        var result = await _searchService.IsQuestionDuplicateAsync(title, content);
        return result.IsSuccess && result.Data;
    }

    public async Task<double> CalculateSimilarityScoreAsync(string text1, string text2)
    {
        return await _searchService.CalculateSemanticSimilarityAsync(text1, text2);
    }

    public async Task NotifyExpertsAsync(Guid questionId, string category)
    {
        // TODO: Implement expert notification logic
        // This will be implemented in later tasks with proper notification system
        await Task.CompletedTask;
    }

    public async Task UpdateQuestionViewCountAsync(Guid questionId)
    {
        // TODO: Implement view count update logic
        // This will be implemented in later tasks
        await Task.CompletedTask;
    }

    public async Task<List<string>> ExtractTagsFromContentAsync(string content)
    {
        // TODO: Implement automatic tag extraction
        // This will be implemented in later tasks with NLP techniques
        await Task.CompletedTask;
        return new List<string>();
    }

    public async Task<bool> ValidateContentQualityAsync(string content)
    {
        // Delegate to the comprehensive content quality service
        return await _contentQualityService.ValidateContentQualityAsync(content);
    }
}