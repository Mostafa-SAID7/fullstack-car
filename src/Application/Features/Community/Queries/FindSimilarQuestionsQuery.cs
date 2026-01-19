using Application.Common.Models;
using Application.Features.Community.QA.Services;
using MediatR;

namespace Application.Features.Community.QA.Queries;

/// <summary>
/// Query to find similar questions using semantic analysis
/// </summary>
public class FindSimilarQuestionsQuery : IRequest<Result<List<SimilarQuestionResult>>>
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public Guid? ExcludeQuestionId { get; set; }
    public int MaxResults { get; set; } = 5;
    public double MinSimilarityScore { get; set; } = 0.7;
}

/// <summary>
/// Handler for finding similar questions
/// </summary>
public class FindSimilarQuestionsQueryHandler : IRequestHandler<FindSimilarQuestionsQuery, Result<List<SimilarQuestionResult>>>
{
    private readonly IDuplicatePreventionService _duplicatePreventionService;

    public FindSimilarQuestionsQueryHandler(IDuplicatePreventionService duplicatePreventionService)
    {
        _duplicatePreventionService = duplicatePreventionService;
    }

    public async Task<Result<List<SimilarQuestionResult>>> Handle(FindSimilarQuestionsQuery request, CancellationToken cancellationToken)
    {
        return await _duplicatePreventionService.FindSimilarQuestionsAsync(
            request.Title,
            request.Content,
            request.Category,
            request.Tags,
            request.ExcludeQuestionId,
            request.MaxResults,
            request.MinSimilarityScore,
            cancellationToken);
    }
}