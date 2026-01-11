namespace Application.Features.Community.QA.DTOs.Responses;

/// <summary>
/// DTO for real-time vote updates
/// </summary>
public class VoteUpdateDto
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

/// <summary>
/// DTO for answer acceptance notifications
/// </summary>
public class AnswerAcceptedDto
{
    public Guid AnswerId { get; set; }
    public Guid QuestionId { get; set; }
    public Guid AcceptedByUserId { get; set; }
    public string AcceptedByUserName { get; set; } = string.Empty;
    public Guid AnswerAuthorId { get; set; }
    public string AnswerAuthorName { get; set; } = string.Empty;
    public int ReputationBonus { get; set; }
    public DateTime AcceptedAt { get; set; } = DateTime.UtcNow;
    public string QuestionTitle { get; set; } = string.Empty;
}

/// <summary>
/// DTO for typing indicators during answer composition
/// </summary>
public class TypingIndicatorDto
{
    public Guid QuestionId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public bool IsTyping { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// DTO for reputation update notifications
/// </summary>
public class ReputationUpdateDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int OldReputation { get; set; }
    public int NewReputation { get; set; }
    public int Change { get; set; }
    public string Reason { get; set; } = string.Empty; // "Answer Upvoted", "Answer Accepted", etc.
    public Guid? RelatedContentId { get; set; }
    public string? RelatedContentType { get; set; } // "Question" or "Answer"
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public List<string> BadgesEarned { get; set; } = new();
}

/// <summary>
/// DTO for question closed notifications
/// </summary>
public class QuestionClosedDto
{
    public Guid QuestionId { get; set; }
    public string QuestionTitle { get; set; } = string.Empty;
    public Guid ClosedByUserId { get; set; }
    public string ClosedByUserName { get; set; } = string.Empty;
    public string ClosedReason { get; set; } = string.Empty;
    public DateTime ClosedAt { get; set; } = DateTime.UtcNow;
    public Guid QuestionAuthorId { get; set; }
}

/// <summary>
/// DTO for expert notifications about new questions in their expertise areas
/// </summary>
public class ExpertNotificationDto
{
    public Guid QuestionId { get; set; }
    public string QuestionTitle { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public Guid QuestionAuthorId { get; set; }
    public string QuestionAuthorName { get; set; } = string.Empty;
    public int QuestionAuthorReputation { get; set; }
    public DateTime QuestionCreatedAt { get; set; }
    public List<Guid> NotifiedExpertIds { get; set; } = new();
    public string NotificationReason { get; set; } = string.Empty; // "Category Expert", "Tag Expert", etc.
}

/// <summary>
/// DTO for connection status updates
/// </summary>
public class ConnectionStatusDto
{
    public string Status { get; set; } = string.Empty; // "Connected", "Disconnected", "Reconnecting"
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? Message { get; set; }
    public int ActiveConnections { get; set; }
}

/// <summary>
/// DTO for question view count updates
/// </summary>
public class QuestionViewUpdateDto
{
    public Guid QuestionId { get; set; }
    public int NewViewCount { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// DTO for new question notifications to category followers
/// </summary>
public class NewQuestionNotificationDto
{
    public QuestionDto Question { get; set; } = new();
    public string NotificationReason { get; set; } = string.Empty; // "Category Follower", "Tag Follower"
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}