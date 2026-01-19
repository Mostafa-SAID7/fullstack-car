using Domain.Base;

namespace Domain.Entities.Community;

/// <summary>
/// User Feedback Entity
/// Tracks user satisfaction and feedback for the community system
/// </summary>
public class UserFeedback : BaseAuditableEntity
{
    public Guid UserId { get; set; }
    public string FeedbackType { get; set; } = string.Empty; // "QuestionSatisfaction", "AnswerHelpfulness", "SatisfactionSurvey", etc.
    public int Rating { get; set; } // 1-5 scale
    public string? Comment { get; set; }
    public string? Category { get; set; }
    public Guid? RelatedContentId { get; set; } // Question/Answer ID if applicable
    public string? RelatedContentType { get; set; } // "Question", "Answer", etc.
    public Dictionary<string, object>? Metadata { get; set; }
    
    // Navigation properties
    public virtual Domain.Entities.Identity.ApplicationUser User { get; set; } = null!;
}
