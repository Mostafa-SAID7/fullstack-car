using Domain.Enums.Common;

namespace Application.Features.Filters.Advanced.DTOs.Requests;

public class FilterRequest
{
    public string ContentType { get; set; } = string.Empty;
    public List<string> Categories { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public string SortBy { get; set; } = "created"; // created, updated, popularity, votes, views
    public string SortOrder { get; set; } = "desc"; // asc, desc
    public string SearchTerm { get; set; } = string.Empty;
    public Guid? AuthorId { get; set; }
    public int? MinVotes { get; set; }
    public int? MaxVotes { get; set; }
    public int? MinViews { get; set; }
    public int? MaxViews { get; set; }
    public bool? HasAnswers { get; set; }
    public bool? IsAnswered { get; set; }
    public string Status { get; set; } = string.Empty; // active, closed, pending
}