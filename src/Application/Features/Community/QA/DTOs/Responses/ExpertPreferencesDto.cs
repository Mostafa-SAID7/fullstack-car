namespace Application.Features.Community.QA.DTOs.Responses;

public class ExpertPreferencesDto
{
    public Guid UserId { get; set; }
    public List<string> PreferredCategories { get; set; } = new();
    public bool ReceiveNotifications { get; set; } = true;
    public string NotificationFrequency { get; set; } = "Immediate";
    public int MaxQuestionsPerDay { get; set; } = 10;
    public bool AutoAcceptInvitations { get; set; } = false;
    public Dictionary<string, object> CustomSettings { get; set; } = new();
}