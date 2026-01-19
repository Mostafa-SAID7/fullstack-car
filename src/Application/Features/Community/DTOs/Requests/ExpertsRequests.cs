namespace Application.Features.Community.QA.DTOs.Requests;

public class PromoteExpertRequest
{
    public string Category { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}

public class UpdateExpertStatsRequest
{
    public string Category { get; set; } = string.Empty;
    public string ActivityType { get; set; } = string.Empty;
}

public class NotifyExpertsRequest
{
    public Guid QuestionId { get; set; }
    public string Category { get; set; } = string.Empty;
}

public class UpdateNotificationPreferencesRequest
{
    public string Category { get; set; } = string.Empty;
    public bool Enabled { get; set; }
}

public class AddExpertiseCategoryRequest
{
    public string Category { get; set; } = string.Empty;
}
