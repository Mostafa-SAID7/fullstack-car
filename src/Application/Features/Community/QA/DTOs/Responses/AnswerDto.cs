namespace Application.Features.Community.QA.DTOs.Responses;

public class AnswerDto
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int VoteScore { get; set; }
    public bool IsAccepted { get; set; }
    public bool IsDeleted { get; set; }
    public string Status { get; set; } = string.Empty;
}