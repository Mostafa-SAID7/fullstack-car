namespace Application.Features.Community.QA.DTOs.Responses;

public class ActiveConnectionDto
{
    public string ConnectionId { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime ConnectedAt { get; set; }
    public DateTime LastActivity { get; set; }
    public string UserAgent { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<string> JoinedGroups { get; set; } = new();
}