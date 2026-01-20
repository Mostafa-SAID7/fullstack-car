namespace Application.Features.Filters.Related.DTOs.Responses;

public class RelatedContentResponse
{
    public List<RelatedItem> Items { get; set; } = new();
    public string Algorithm { get; set; } = string.Empty;
    public double AverageSimilarity { get; set; }
}

public class RelatedItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public double SimilarityScore { get; set; }
    public string SimilarityReason { get; set; } = string.Empty;
    public int Views { get; set; }
    public int Votes { get; set; }
    public DateTime CreatedAt { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}