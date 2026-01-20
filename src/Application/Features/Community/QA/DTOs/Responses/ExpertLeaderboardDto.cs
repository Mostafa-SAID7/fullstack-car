namespace Application.Features.Community.QA.DTOs.Responses;

public class ExpertLeaderboardDto
{
    public List<ExpertRankingDto> TopExperts { get; set; } = new();
    public string Category { get; set; } = string.Empty;
    public string TimePeriod { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
    public int TotalExperts { get; set; }
    public Dictionary<string, object> LeaderboardStats { get; set; } = new();
}