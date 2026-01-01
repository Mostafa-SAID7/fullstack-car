using Domain.Base;

namespace Domain.Entities.Community.Guides;

public class GuideStep : BaseAuditableEntity
{
    public Guid GuideId { get; set; }
    public Guide Guide { get; set; } = null!;
    
    public int StepNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public bool IsRequired { get; set; } = true;
    public string? Tips { get; set; }
    public string? WarningNotes { get; set; }
    public int EstimatedTime { get; set; } // in minutes
}