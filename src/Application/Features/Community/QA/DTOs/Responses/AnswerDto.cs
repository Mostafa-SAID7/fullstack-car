namespace Application.Features.Community.QA.DTOs.Responses;

public class AnswerDto
{
    public Guid Id { get; set; }
    public Guid QuestionId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int VoteScore { get; set; }
    public int UpvotesCount { get; set; }
    public int DownvotesCount { get; set; }
    public bool IsAccepted { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int UserReputation { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UserVote { get; set; } // null = no vote, "Up" = upvote, "Down" = downvote
    public bool IsEdited { get; set; }
    public List<AnswerVersionDto> VersionHistory { get; set; } = new();
}

public class AnswerVersionDto
{
    public int Version { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string EditReason { get; set; } = string.Empty;
}