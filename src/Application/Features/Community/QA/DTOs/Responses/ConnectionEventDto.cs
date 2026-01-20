namespace Application.Features.Community.QA.DTOs.Responses;

public class ConnectionEventDto
{
    public string EventType { get; set; } = string.Empty;
    public string ConnectionId { get; set; } = string.Empty;
    public Guid? UserId { get; set; }
    public string? UserName { get; set; }
    public DateTime Timestamp { get; set; }
    public string? Details { get; set; }
}