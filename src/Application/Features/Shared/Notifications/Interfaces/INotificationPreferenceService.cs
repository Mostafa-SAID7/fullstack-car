using Domain.Entities.Shared.Notifications;

namespace Application.Features.Shared.Notifications.Interfaces
{
    public interface INotificationPreferenceService
    {
        Task<IEnumerable<NotificationPreference>> GetUserPreferencesAsync(string userId, CancellationToken cancellationToken = default);
        Task<NotificationPreference?> GetPreferenceAsync(Guid preferenceId, CancellationToken cancellationToken = default);
        Task<NotificationPreference?> GetPreferenceByTypeAsync(string userId, string notificationType, CancellationToken cancellationToken = default);
        Task<NotificationPreference> UpsertPreferenceAsync(
            string userId,
            string notificationType,
            bool emailEnabled,
            bool pushEnabled,
            bool smsEnabled,
            bool inAppEnabled,
            string frequency,
            CancellationToken cancellationToken = default);
        Task UpdatePreferencesAsync(string userId, IEnumerable<NotificationPreference> preferences, CancellationToken cancellationToken = default);
        Task DeletePreferenceAsync(Guid preferenceId, CancellationToken cancellationToken = default);
        Task RegisterDeviceTokenAsync(string userId, string deviceToken, string platform, CancellationToken cancellationToken = default);
        Task UnregisterDeviceTokenAsync(string deviceToken, CancellationToken cancellationToken = default);
        Task<IEnumerable<string>> GetUserDeviceTokensAsync(string userId, CancellationToken cancellationToken = default);
        Task<bool> IsChannelEnabledAsync(string userId, string notificationType, string channel, CancellationToken cancellationToken = default);
    }
}
