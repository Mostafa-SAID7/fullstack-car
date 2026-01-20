namespace Application.Features.Community.QA.DTOs.Responses;

public class QuestionClosedDto
{
    public Guid QuestionId { get; set; }
    public Guid QuestionAuthorId { get; set; }
    public string QuestionTitle { get; set; } = string.Empty;
    public string CloseReason { get; set; } = string.Empty;
    public Guid ClosedByUserId { get; set; }
    public string ClosedByUserName { get; set; } = string.Empty;
    public DateTime ClosedAt { get; set; }
}