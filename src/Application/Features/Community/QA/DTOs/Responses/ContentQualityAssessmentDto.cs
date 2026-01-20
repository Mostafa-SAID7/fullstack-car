namespace Application.Features.Community.QA.DTOs.Responses;

public class ContentQualityAssessmentDto
{
    public bool IsHighQuality { get; set; }
    public double QualityScore { get; set; }
    public List<string> Issues { get; set; } = new();
    public List<string> Suggestions { get; set; } = new();
    public int WordCount { get; set; }
    public int SentenceCount { get; set; }
    public double ReadabilityScore { get; set; }
    public bool HasCodeBlocks { get; set; }
    public bool HasLinks { get; set; }
    public bool HasImages { get; set; }
}