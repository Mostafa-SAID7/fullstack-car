namespace Application.Features.Community.QA.DTOs.Responses;

public class ExpertNotificationDto
{
    public Guid QuestionId { get; set; }
    public string QuestionTitle { get; set; } = string.Empty;
    public string QuestionContent { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public List<Guid> NotifiedExpertIds { get; set; } = new();
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}