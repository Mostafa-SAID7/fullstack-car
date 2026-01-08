namespace Application.Features.Media.Discovery.DTOs;

public class SearchSuggestionDto
{
    public string Text { get; set; } = string.Empty;
    public SearchSuggestionType Type { get; set; }
    public int Count { get; set; } // Number of results for this suggestion
    public string? Icon { get; set; }
}

public enum SearchSuggestionType
{
    Title,
    Tag,
    Creator,
    Category,
    Description
}