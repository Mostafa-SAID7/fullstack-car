namespace Application.Features.Community.QA.DTOs.Responses;

public class QuestionSimilarityDto
{
    public Guid QuestionId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public double SimilarityScore { get; set; }
    public DateTime CreatedAt { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public int ViewCount { get; set; }
    public int AnswerCount { get; set; }
    public List<string> Tags { get; set; } = new();
}