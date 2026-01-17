using Domain.Entities.Shared.Notifications;

namespace Application.Features.Shared.Notifications.Interfaces
{
    public interface INotificationPreferenceService
    {
        /// <summary>
        /// Get all notification preferences for a user
        /// </summary>
        Task<IEnumerable<NotificationPreference>> GetUserPreferencesAsync(string userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Get a specific notification preference
        /// </summary>
        Task<NotificationPreference?> GetPreferenceAsync(Guid preferenceId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Get preference for a specific notification type
        /// </summary>
        Task<NotificationPreference?> GetPreferenceByTypeAsync(string userId, string notificationType, CancellationToken cancellationToken = default);

        /// <summary>
        /// Create or update notification preferences
        /// </summary>
        Task<NotificationPreference> UpsertPreferenceAsync(
            string userId,
            string notificationType,
            bool emailEnabled,
            bool pushEnabled,
            bool smsEnabled,
            bool inAppEnabled,
            string frequency,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Update multiple preferences at once
        /// </summary>
        Task UpdatePreferencesAsync(string userId, IEnumerable<NotificationPreference> preferences, CancellationToken cancellationToken = default);

        /// <summary>
        /// Delete a notification preference
        /// </summary>
        Task DeletePreferenceAsync(Guid preferenceId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Register a device token for push notifications
        /// </summary>
        Task RegisterDeviceTokenAsync(string userId, string deviceToken, string platform, CancellationToken cancellationToken = default);

        /// <summary>
        /// Unregister a device token
        /// </summary>
        Task UnregisterDeviceTokenAsync(string deviceToken, CancellationToken cancellationToken = default);

        /// <summary>
        /// Get all device tokens for a user
        /// </summary>
        Task<IEnumerable<string>> GetUserDeviceTokensAsync(string userId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Check if a user has enabled a specific notification channel for a type
        /// </summary>
        Task<bool> IsChannelEnabledAsync(string userId, string notificationType, string channel, CancellationToken cancellationToken = default);
    }
}
