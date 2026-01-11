using System.Text.Json.Serialization;

namespace Application.Features.Community.QA.DTOs.Shared;

/// <summary>
/// Base filtering DTO for QA system queries that works with both Angular and React
/// </summary>
public class BaseFilterDto
{
    [JsonPropertyName("pageNumber")]
    public int PageNumber { get; set; } = 1;

    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; } = 10;

    [JsonPropertyName("sortBy")]
    public string? SortBy { get; set; }

    [JsonPropertyName("sortDirection")]
    public string SortDirection { get; set; } = "desc"; // "asc" or "desc"

    [JsonPropertyName("searchTerm")]
    public string? SearchTerm { get; set; }

    public void ValidateAndNormalize()
    {
        PageNumber = Math.Max(1, PageNumber);
        PageSize = Math.Clamp(PageSize, 1, 100); // Limit page size to prevent abuse
        SortDirection = SortDirection?.ToLowerInvariant() == "asc" ? "asc" : "desc";
        SearchTerm = string.IsNullOrWhiteSpace(SearchTerm) ? null : SearchTerm.Trim();
    }
}

/// <summary>
/// Question filtering DTO for both Angular and React frontends
/// </summary>
public class QuestionFilterDto : BaseFilterDto
{
    [JsonPropertyName("category")]
    public string? Category { get; set; }

    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();

    [JsonPropertyName("status")]
    public string? Status { get; set; } // "open", "closed", "answered", "unanswered"

    [JsonPropertyName("userId")]
    public Guid? UserId { get; set; }

    [JsonPropertyName("hasAcceptedAnswer")]
    public bool? HasAcceptedAnswer { get; set; }

    [JsonPropertyName("minVoteScore")]
    public int? MinVoteScore { get; set; }

    [JsonPropertyName("maxVoteScore")]
    public int? MaxVoteScore { get; set; }

    [JsonPropertyName("dateFrom")]
    public DateTime? DateFrom { get; set; }

    [JsonPropertyName("dateTo")]
    public DateTime? DateTo { get; set; }

    [JsonPropertyName("includeScheduled")]
    public bool IncludeScheduled { get; set; } = false;

    public new void ValidateAndNormalize()
    {
        base.ValidateAndNormalize();
        
        Category = string.IsNullOrWhiteSpace(Category) ? null : Category.Trim();
        Tags = Tags?.Where(t => !string.IsNullOrWhiteSpace(t)).Select(t => t.Trim()).ToList() ?? new List<string>();
        Status = string.IsNullOrWhiteSpace(Status) ? null : Status.Trim().ToLowerInvariant();
        
        // Validate status values
        if (Status != null && !new[] { "open", "closed", "answered", "unanswered" }.Contains(Status))
        {
            Status = null;
        }

        // Ensure date range is valid
        if (DateFrom.HasValue && DateTo.HasValue && DateFrom > DateTo)
        {
            (DateFrom, DateTo) = (DateTo, DateFrom);
        }
    }
}

/// <summary>
/// Answer filtering DTO for both Angular and React frontends
/// </summary>
public class AnswerFilterDto : BaseFilterDto
{
    [JsonPropertyName("questionId")]
    public Guid? QuestionId { get; set; }

    [JsonPropertyName("userId")]
    public Guid? UserId { get; set; }

    [JsonPropertyName("isAccepted")]
    public bool? IsAccepted { get; set; }

    [JsonPropertyName("minVoteScore")]
    public int? MinVoteScore { get; set; }

    [JsonPropertyName("maxVoteScore")]
    public int? MaxVoteScore { get; set; }

    [JsonPropertyName("dateFrom")]
    public DateTime? DateFrom { get; set; }

    [JsonPropertyName("dateTo")]
    public DateTime? DateTo { get; set; }

    public new void ValidateAndNormalize()
    {
        base.ValidateAndNormalize();
        
        // Ensure date range is valid
        if (DateFrom.HasValue && DateTo.HasValue && DateFrom > DateTo)
        {
            (DateFrom, DateTo) = (DateTo, DateFrom);
        }
    }
}

/// <summary>
/// Vote filtering DTO for both Angular and React frontends
/// </summary>
public class VoteFilterDto : BaseFilterDto
{
    [JsonPropertyName("userId")]
    public Guid? UserId { get; set; }

    [JsonPropertyName("contentType")]
    public string? ContentType { get; set; } // "Question" or "Answer"

    [JsonPropertyName("voteType")]
    public string? VoteType { get; set; } // "Up" or "Down"

    [JsonPropertyName("dateFrom")]
    public DateTime? DateFrom { get; set; }

    [JsonPropertyName("dateTo")]
    public DateTime? DateTo { get; set; }

    public new void ValidateAndNormalize()
    {
        base.ValidateAndNormalize();
        
        ContentType = string.IsNullOrWhiteSpace(ContentType) ? null : ContentType.Trim();
        VoteType = string.IsNullOrWhiteSpace(VoteType) ? null : VoteType.Trim();
        
        // Validate content type values
        if (ContentType != null && !new[] { "Question", "Answer" }.Contains(ContentType))
        {
            ContentType = null;
        }
        
        // Validate vote type values
        if (VoteType != null && !new[] { "Up", "Down" }.Contains(VoteType))
        {
            VoteType = null;
        }

        // Ensure date range is valid
        if (DateFrom.HasValue && DateTo.HasValue && DateFrom > DateTo)
        {
            (DateFrom, DateTo) = (DateTo, DateFrom);
        }
    }
}

/// <summary>
/// Search filtering DTO for both Angular and React frontends
/// </summary>
public class SearchFilterDto : BaseFilterDto
{
    [JsonPropertyName("categories")]
    public List<string> Categories { get; set; } = new();

    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();

    [JsonPropertyName("contentTypes")]
    public List<string> ContentTypes { get; set; } = new(); // "Question", "Answer"

    [JsonPropertyName("minVoteScore")]
    public int? MinVoteScore { get; set; }

    [JsonPropertyName("hasAcceptedAnswer")]
    public bool? HasAcceptedAnswer { get; set; }

    [JsonPropertyName("dateFrom")]
    public DateTime? DateFrom { get; set; }

    [JsonPropertyName("dateTo")]
    public DateTime? DateTo { get; set; }

    [JsonPropertyName("includeContent")]
    public bool IncludeContent { get; set; } = true;

    [JsonPropertyName("includeTags")]
    public bool IncludeTags { get; set; } = true;

    [JsonPropertyName("includeUserInfo")]
    public bool IncludeUserInfo { get; set; } = true;

    public new void ValidateAndNormalize()
    {
        base.ValidateAndNormalize();
        
        Categories = Categories?.Where(c => !string.IsNullOrWhiteSpace(c)).Select(c => c.Trim()).ToList() ?? new List<string>();
        Tags = Tags?.Where(t => !string.IsNullOrWhiteSpace(t)).Select(t => t.Trim()).ToList() ?? new List<string>();
        ContentTypes = ContentTypes?.Where(ct => !string.IsNullOrWhiteSpace(ct)).Select(ct => ct.Trim()).ToList() ?? new List<string>();
        
        // Validate content types
        var validContentTypes = new[] { "Question", "Answer" };
        ContentTypes = ContentTypes.Where(ct => validContentTypes.Contains(ct)).ToList();
        
        // If no content types specified, include both
        if (!ContentTypes.Any())
        {
            ContentTypes = validContentTypes.ToList();
        }

        // Ensure date range is valid
        if (DateFrom.HasValue && DateTo.HasValue && DateFrom > DateTo)
        {
            (DateFrom, DateTo) = (DateTo, DateFrom);
        }
    }
}