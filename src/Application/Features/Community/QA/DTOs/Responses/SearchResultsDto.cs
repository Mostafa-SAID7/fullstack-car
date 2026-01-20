using Application.Common.Models;

namespace Application.Features.Community.QA.DTOs.Responses;

public class SearchResultsDto
{
    public PaginatedList<QuestionSearchResultDto> Questions { get; set; } = new(new List<QuestionSearchResultDto>(), 0, 1, 10);
    public List<string> SearchSuggestions { get; set; } = new();
    public Dictionary<string, int> CategoryCounts { get; set; } = new();
    public Dictionary<string, int> TagCounts { get; set; } = new();
    public SearchMetadataDto Metadata { get; set; } = new();
}

public class QuestionSearchResultDto : QuestionListDto
{
    public double RelevanceScore { get; set; }
    public List<string> HighlightedSnippets { get; set; } = new();
}

public class SearchMetadataDto
{
    public int TotalResults { get; set; }
    public long SearchDurationMs { get; set; }
    public string SearchId { get; set; } = string.Empty;
    public DateTime SearchTimestamp { get; set; }
    public Dictionary<string, object> SearchParameters { get; set; } = new();
}