namespace Application.Features.Community.QA.DTOs.Responses;

public class SearchAnalyticsDto
{
    public int TotalSearches { get; set; }
    public int UniqueUsers { get; set; }
    public Dictionary<string, int> TopSearchTerms { get; set; } = new();
    public Dictionary<string, int> TopCategories { get; set; } = new();
    public Dictionary<string, int> TopTags { get; set; } = new();
    public double AverageResultsPerSearch { get; set; }
    public double AverageSearchDuration { get; set; }
    public List<SearchTrendDto> SearchTrends { get; set; } = new();
}