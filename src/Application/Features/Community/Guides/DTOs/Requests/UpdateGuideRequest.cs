using Domain.Enums.Community.Guides;

namespace Application.Features.Community.Guides.DTOs.Requests;

public class UpdateGuideRequest
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public GuideCategory Category { get; set; }
    public GuideDifficulty Difficulty { get; set; }
    public int EstimatedReadTime { get; set; }
    public string Tags { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public List<UpdateGuideStepRequest> Steps { get; set; } = new();
}

public class UpdateGuideStepRequest
{
    public Guid? Id { get; set; }
    public int StepNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public bool IsRequired { get; set; } = true;
    public string? Tips { get; set; }
    public string? WarningNotes { get; set; }
    public int EstimatedTime { get; set; }
}
