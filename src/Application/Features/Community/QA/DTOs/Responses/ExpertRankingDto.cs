namespace Application.Features.Community.QA.DTOs.Responses;

public class ExpertRankingDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string ExpertiseArea { get; set; } = string.Empty;
    public double ExpertiseScore { get; set; }
    public int Rank { get; set; }
    public int TotalAnswers { get; set; }
    public int AcceptedAnswers { get; set; }
    public double AcceptanceRate { get; set; }
    public int ReputationScore { get; set; }
    public List<string> Badges { get; set; } = new();
}