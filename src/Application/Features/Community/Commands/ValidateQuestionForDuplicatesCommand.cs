using Application.Common.Models;
using Application.Features.Community.Services;
using MediatR;

namespace Application.Features.Community.Commands;

/// <summary>
/// Command to validate a question for duplicates before creation
/// </summary>
public class ValidateQuestionForDuplicatesCommand : IRequest<Result<QuestionValidationResult>>
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public double? DuplicateThreshold { get; set; }
    public double? SimilarityThreshold { get; set; }
    public int? MaxSimilarQuestions { get; set; }
}

/// <summary>
/// Handler for validating questions for duplicates
/// </summary>
public class ValidateQuestionForDuplicatesCommandHandler : IRequestHandler<ValidateQuestionForDuplicatesCommand, Result<QuestionValidationResult>>
{
    private readonly IDuplicatePreventionService _duplicatePreventionService;

    public ValidateQuestionForDuplicatesCommandHandler(IDuplicatePreventionService duplicatePreventionService)
    {
        _duplicatePreventionService = duplicatePreventionService;
    }

    public async Task<Result<QuestionValidationResult>> Handle(ValidateQuestionForDuplicatesCommand request, CancellationToken cancellationToken)
    {
        return await _duplicatePreventionService.ValidateQuestionForDuplicatesAsync(
            request.Title,
            request.Content,
            request.Category,
            request.Tags,
            cancellationToken);
    }
}
