namespace Application.Features.Community.QA.DTOs.Responses;

public class ConnectionStatusDto
{
    public string Status { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public int? ActiveConnections { get; set; }
    public string? ClientType { get; set; }
    public bool? OptimizationsEnabled { get; set; }
}