namespace Application.Features.Community.QA.DTOs.Responses;

public class SimilarQuestionResult
{
    public Guid QuestionId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public double SimilarityScore { get; set; }
    public string SimilarityReason { get; set; } = string.Empty;
    public int AnswersCount { get; set; }
    public bool HasAcceptedAnswer { get; set; }
    public DateTime CreatedAt { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
}