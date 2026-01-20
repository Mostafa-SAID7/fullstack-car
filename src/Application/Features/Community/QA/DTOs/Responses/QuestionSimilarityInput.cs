namespace Application.Features.Community.QA.DTOs.Responses;

public class QuestionSimilarityInput
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public int VoteScore { get; set; }
    public int ViewCount { get; set; }
}