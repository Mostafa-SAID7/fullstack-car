namespace Application.Features.Community.QA.DTOs.Responses;

public class MetricDataPointDto
{
    public DateTime Date { get; set; }
    public double Value { get; set; }
    public string? Label { get; set; }
    public string? Category { get; set; }
}