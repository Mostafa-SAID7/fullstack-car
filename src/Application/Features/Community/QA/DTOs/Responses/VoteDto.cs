using Domain.Enums.Community.QA;

namespace Application.Features.Community.QA.DTOs.Responses;

public class VoteDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ContentId { get; set; }
    public string ContentType { get; set; } = string.Empty; // "Question" or "Answer"
    public VoteType VoteType { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Additional properties for UI display
    public string ContentTitle { get; set; } = string.Empty; // Question title or answer preview
    public string ContentUrl { get; set; } = string.Empty; // URL to the content
    public int ContentVoteScore { get; set; } // Current vote score of the content
    public Guid? QuestionId { get; set; } // For answers, the ID of the parent question (used for URL building)
}