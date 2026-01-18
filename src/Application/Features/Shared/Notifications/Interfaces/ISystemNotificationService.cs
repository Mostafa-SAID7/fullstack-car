namespace Application.Features.Shared.Notifications.Interfaces
{
    public interface ISystemNotificationService
    {
        // System Notifications
        Task SendSystemNotificationAsync(string userId, string title, string message, string priority = "Medium", string? targetUrl = null);
        Task SendSecurityNotificationAsync(string userId, string title, string message, string? targetUrl = null);
        Task SendSystemBroadcastAsync(string title, string message, string priority = "Medium");
        Task NotifySystemMaintenanceAsync(DateTime maintenanceTime, string message);
        Task NotifySystemUpdateAsync(string version, string updateNotes);
    }
}