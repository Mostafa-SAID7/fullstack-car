using Application.Common.DTOs;

namespace Application.Features.Community.QA.DTOs;

public class NotifyExpertsRequest
{
    public Guid QuestionId { get; set; }
    public List<string> ExpertTags { get; set; } = new();
    public string? CustomMessage { get; set; }
}

public class FindSimilarQuestionsRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public List<string> Tags { get; set; } = new();
    public int MaxResults { get; set; } = 10;
}

public class CheckDuplicateRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public double SimilarityThreshold { get; set; } = 0.8;
}

public class CalculateRelevanceRequest
{
    public string SearchTerm { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public Dictionary<string, double> Weights { get; set; } = new();
}

public class CalculateSimilarityRequest
{
    public string Text1 { get; set; } = string.Empty;
    public string Text2 { get; set; } = string.Empty;
    public string Algorithm { get; set; } = "cosine"; // cosine, jaccard, levenshtein
}

public class ValidateQuestionRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public bool CheckDuplicates { get; set; } = true;
}

public class DetectDuplicateRequest
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public double Threshold { get; set; } = 0.8;
}

public class TagSuggestionRequest
{
    public string Content { get; set; } = string.Empty;
    public string? Title { get; set; }
    public int MaxSuggestions { get; set; } = 10;
}

// QA-specific filtering DTOs extending common base classes
public class QuestionFilterDto : CategoryTagFilterDto
{
    public string? Status { get; set; } // "open", "closed", "answered", "unanswered"
    public Guid? UserId { get; set; }
    public bool? HasAcceptedAnswer { get; set; }
    public int? MinVoteScore { get; set; }
    public int? MaxVoteScore { get; set; }
    public bool IncludeScheduled { get; set; } = false;

    public override void ValidateAndNormalize()
    {
        base.ValidateAndNormalize();
        
        Status = string.IsNullOrWhiteSpace(Status) ? null : Status.Trim().ToLowerInvariant();
        
        // Validate status values
        if (Status != null && !new[] { "open", "closed", "answered", "unanswered" }.Contains(Status))
        {
            Status = null;
        }
    }
}

public class AnswerFilterDto : DateRangeFilterDto
{
    public Guid? QuestionId { get; set; }
    public Guid? UserId { get; set; }
    public bool? IsAccepted { get; set; }
    public int? MinVoteScore { get; set; }
    public int? MaxVoteScore { get; set; }
}

public class VoteFilterDto : DateRangeFilterDto
{
    public Guid? UserId { get; set; }
    public string? ContentType { get; set; } // "Question" or "Answer"
    public string? VoteType { get; set; } // "Up" or "Down"

    public override void ValidateAndNormalize()
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
    }
}

public class QASearchFilterDto : ContentTypeFilterDto
{
    public bool? HasAcceptedAnswer { get; set; }
    public int? MinVoteScore { get; set; }
    public bool IncludeUserInfo { get; set; } = true;

    public override void ValidateAndNormalize()
    {
        base.ValidateAndNormalize();
        
        // Validate content types for QA
        var validContentTypes = new[] { "Question", "Answer" };
        ContentTypes = ContentTypes.Where(ct => validContentTypes.Contains(ct)).ToList();
        
        // If no content types specified, include both
        if (!ContentTypes.Any())
        {
            ContentTypes = validContentTypes.ToList();
        }
    }
}