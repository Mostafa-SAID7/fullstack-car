namespace Application.Features.Community.QA.DTOs.Responses;

public class AnswerAcceptedDto
{
    public Guid AnswerId { get; set; }
    public Guid QuestionId { get; set; }
    public Guid AnswerAuthorId { get; set; }
    public Guid QuestionAuthorId { get; set; }
    public string AnswerContent { get; set; } = string.Empty;
    public DateTime AcceptedAt { get; set; }
}