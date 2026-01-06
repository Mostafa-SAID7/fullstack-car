using Domain.Entities.Identity;

namespace Domain.Entities.Admin.Moderation;

public class AutoModerationRule : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string RuleType { get; set; } = string.Empty; // Keyword, Pattern, ML, etc.
    public string Conditions { get; set; } = string.Empty; // JSON configuration for conditions
    public string Actions { get; set; } = string.Empty; // JSON configuration for actions
    public bool IsActive { get; set; } = true;
    public int Priority { get; set; } = 1;
    public Guid CreatedByUserId { get; set; }
    public DateTime? LastTriggered { get; set; }
    public int TriggerCount { get; set; } = 0;

    // Additional properties expected by Infrastructure
    public string Pattern { get; set; } = string.Empty; // Regex pattern or keyword
    public string Action { get; set; } = string.Empty; // Action to take (Flag, Remove, etc.)
    public string Severity { get; set; } = "Medium"; // Low, Medium, High

    // Navigation properties
    public ApplicationUser CreatedByUser { get; set; } = null!;
}
