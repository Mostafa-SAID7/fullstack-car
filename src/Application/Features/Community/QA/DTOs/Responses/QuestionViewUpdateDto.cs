namespace Application.Features.Community.QA.DTOs.Responses;

public class QuestionViewUpdateDto
{
    public Guid QuestionId { get; set; }
    public int NewViewCount { get; set; }
    public Guid? ViewerId { get; set; }
    public DateTime ViewedAt { get; set; }
}