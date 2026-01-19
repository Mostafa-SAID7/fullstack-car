using Application.Common.Patterns;
using Application.Features.Community.Services;
using MediatR;

namespace Application.Features.Community.Commands;

/// <summary>
/// Command to promote a user to expert status in a category
/// </summary>
public class PromoteToExpertCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}

/// <summary>
/// Command to update expert notification preferences
/// </summary>
public class UpdateExpertNotificationPreferencesCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
    public bool Enabled { get; set; }
}

/// <summary>
/// Command to update comprehensive expert preferences
/// </summary>
public class UpdateExpertPreferencesCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public ExpertPreferencesDto Preferences { get; set; } = new();
}

/// <summary>
/// Command to add expertise category for a user
/// </summary>
public class AddExpertiseCategoryCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// Command to remove expertise category for a user
/// </summary>
public class RemoveExpertiseCategoryCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// Command to notify experts about a new question
/// </summary>
public class NotifyExpertsForQuestionCommand : IRequest<Result<bool>>
{
    public Guid QuestionId { get; set; }
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// Command to update expert statistics after activity
/// </summary>
public class UpdateExpertStatsCommand : IRequest<Result<bool>>
{
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string ActivityType { get; set; } = string.Empty; // "answer_created", "answer_accepted", "vote_received"
}

/// <summary>
/// Command to check and award expert badges
/// </summary>
public class CheckAndAwardExpertBadgesCommand : IRequest<Result<List<string>>>
{
    public Guid UserId { get; set; }
    public string Category { get; set; } = string.Empty;
}
