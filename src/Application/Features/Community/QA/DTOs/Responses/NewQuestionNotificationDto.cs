namespace Application.Features.Community.QA.DTOs.Responses;

public class NewQuestionNotificationDto
{
    public Guid QuestionId { get; set; }
    public QuestionDto Question { get; set; } = new();
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}