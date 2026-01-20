namespace Application.Features.Community.QA.DTOs.Responses;

public class TypingIndicatorDto
{
    public Guid QuestionId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public bool IsTyping { get; set; }
    public DateTime Timestamp { get; set; }
}