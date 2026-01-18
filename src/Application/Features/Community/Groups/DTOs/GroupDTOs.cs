namespace Application.Features.Community.Groups.DTOs;

public class ModerateGroupRequest
{
    public string Action { get; set; } = string.Empty; // approve, reject, suspend, warn
    public string? Reason { get; set; }
    public string? Notes { get; set; }
    public DateTime? SuspensionEndDate { get; set; }
}