namespace Application.Features.Community.DTOs.Responses;

public class UserReputationDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int ReputationScore { get; set; }
    public int QuestionsAsked { get; set; }
    public int AnswersGiven { get; set; }
    public int AcceptedAnswers { get; set; }
    public int UpvotesReceived { get; set; }
    public int DownvotesReceived { get; set; }
    public List<string> BadgesEarned { get; set; } = new();
    public List<string> ExpertiseAreas { get; set; } = new();
    public DateTime LastUpdated { get; set; }
    public int Rank { get; set; }
}

public class ReputationHistoryDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string ActivityType { get; set; } = string.Empty;
    public Guid? ContentId { get; set; }
    public string Category { get; set; } = string.Empty;
    public int ReputationChange { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class ExpertDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ExpertiseLevel { get; set; } = string.Empty;
    public int AnswerCount { get; set; }
    public int AcceptedAnswerCount { get; set; }
    public decimal AverageRating { get; set; }
    public decimal ResponseRate { get; set; }
    public int ReputationScore { get; set; }
    public List<string> BadgesEarned { get; set; } = new();
}
