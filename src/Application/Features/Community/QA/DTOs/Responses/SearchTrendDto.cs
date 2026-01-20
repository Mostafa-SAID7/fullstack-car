namespace Application.Features.Community.QA.DTOs.Responses;

public class SearchTrendDto
{
    public DateTime Date { get; set; }
    public int SearchCount { get; set; }
    public int ResultCount { get; set; }
    public double AverageDuration { get; set; }
}