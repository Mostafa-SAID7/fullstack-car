namespace Application.Features.Community.QA.DTOs.Responses;

public class SystemAlertDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string AlertType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Source { get; set; }
    public bool IsResolved { get; set; }
    public bool IsActive { get; set; }
}