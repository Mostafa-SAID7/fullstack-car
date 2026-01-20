namespace Application.Features.Community.QA.DTOs.Responses;

public class ReputationUpdateDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int NewReputationScore { get; set; }
    public int ReputationChange { get; set; }
    public string ChangeReason { get; set; } = string.Empty;
    public List<string> BadgesEarned { get; set; } = new();
    public DateTime Timestamp { get; set; }
}