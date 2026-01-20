namespace Application.Features.Community.QA.DTOs.Responses;

public class AdvancedSearchRequest
{
    public string SearchTerm { get; set; } = string.Empty;
    public List<string> Categories { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int? MinVotes { get; set; }
    public int? MaxVotes { get; set; }
    public bool? HasAcceptedAnswer { get; set; }
    public bool? IsClosed { get; set; }
    public string SortBy { get; set; } = "Relevance";
    public bool SortDescending { get; set; } = true;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public bool HighlightMatches { get; set; } = true;
}