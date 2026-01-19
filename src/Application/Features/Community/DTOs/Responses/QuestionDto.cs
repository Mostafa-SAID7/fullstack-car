namespace Application.Features.Community.DTOs.Responses;

public class QuestionDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public int ViewCount { get; set; }
    public int VoteScore { get; set; }
    public int UpvotesCount { get; set; }
    public int DownvotesCount { get; set; }
    public int AnswerCount { get; set; }
    public Guid? AcceptedAnswerId { get; set; }
    public bool IsClosed { get; set; }
    public string? ClosedReason { get; set; }
    public bool IsScheduled { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int UserReputation { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UserVote { get; set; } // null = no vote, "Up" = upvote, "Down" = downvote
}

public class QuestionListDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public int ViewCount { get; set; }
    public int VoteScore { get; set; }
    public int AnswerCount { get; set; }
    public bool HasAcceptedAnswer { get; set; }
    public bool IsClosed { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int UserReputation { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastActivityAt { get; set; }
}

public class QuestionDetailDto : QuestionDto
{
    public List<AnswerDto> Answers { get; set; } = new();
    public List<QuestionSimilarityDto> SimilarQuestions { get; set; } = new();
}

public class QuestionSimilarityDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int VoteScore { get; set; }
    public double SimilarityScore { get; set; }
    public int AnswerCount { get; set; }
    public bool HasAcceptedAnswer { get; set; }
    public DateTime CreatedAt { get; set; }
}
