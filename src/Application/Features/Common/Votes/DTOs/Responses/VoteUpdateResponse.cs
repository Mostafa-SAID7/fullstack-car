namespace Application.Features.Common.Votes.DTOs.Responses;

/// <summary>
/// DTO for real-time vote updates
/// </summary>
public class VoteUpdateResponse
{
    public Guid ContentId { get; set; }
    public string ContentType { get; set; } = string.Empty; // "Question" or "Answer"
    public int NewVoteScore { get; set; }
    public int UpvotesCount { get; set; }
    public int DownvotesCount { get; set; }
    public Guid VoterId { get; set; }
    public string VoteType { get; set; } = string.Empty; // "Up", "Down", "Removed"
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}