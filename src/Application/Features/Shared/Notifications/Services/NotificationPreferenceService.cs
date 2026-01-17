using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Shared.Notifications;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Features.Shared.Notifications.Services
{
    public class NotificationPreferenceService : INotificationPreferenceService
    {
        private readonly ILogger<NotificationPreferenceService> _logger;
        private readonly IRepository<NotificationPreference> _preferenceRepository;
        private readonly IRepository<DeviceToken> _deviceTokenRepository;

        public NotificationPreferenceService(
            ILogger<NotificationPreferenceService> logger,
            IRepository<NotificationPreference> preferenceRepository,
            IRepository<DeviceToken> deviceTokenRepository)
        {
            _logger = logger;
            _preferenceRepository = preferenceRepository;
            _deviceTokenRepository = deviceTokenRepository;
        }

        public async Task<IEnumerable<NotificationPreference>> GetUserPreferencesAsync(string userId, CancellationToken cancellationToken = default)
        {
            if (!Guid.TryParse(userId, out var userGuid))
            {
                return Enumerable.Empty<NotificationPreference>();
            }

            var allPreferences = await _preferenceRepository.ListAllAsync(cancellationToken);
            return allPreferences.Where(p => p.UserId == userGuid && !p.IsDeleted).ToList();
        }

        public async Task<NotificationPreference?> GetPreferenceAsync(Guid preferenceId, CancellationToken cancellationToken = default)
        {
            return await _preferenceRepository.GetByIdAsync(preferenceId, cancellationToken);
        }

        public async Task<NotificationPreference?> GetPreferenceByTypeAsync(string userId, string notificationType, CancellationToken cancellationToken = default)
        {
            if (!Guid.TryParse(userId, out var userGuid))
            {
                return null;
            }

            var allPreferences = await _preferenceRepository.ListAllAsync(cancellationToken);
            return allPreferences.FirstOrDefault(p => 
                p.UserId == userGuid && 
                p.NotificationType == notificationType && 
                !p.IsDeleted);
        }

        public async Task<NotificationPreference> UpsertPreferenceAsync(
            string userId,
            string notificationType,
            bool emailEnabled,
            bool pushEnabled,
            bool smsEnabled,
            bool inAppEnabled,
            string frequency,
            CancellationToken cancellationToken = default)
        {
            if (!Guid.TryParse(userId, out var userGuid))
            {
                throw new ArgumentException("Invalid user ID", nameof(userId));
            }

            // Check if preference already exists
            var existing = await GetPreferenceByTypeAsync(userId, notificationType, cancellationToken);

            if (existing != null)
            {
                // Update existing preference
                existing.EmailEnabled = emailEnabled;
                existing.PushEnabled = pushEnabled;
                existing.SmsEnabled = smsEnabled;
                existing.InAppEnabled = inAppEnabled;
                existing.Frequency = frequency;
                existing.UpdatedAt = DateTime.UtcNow;

                await _preferenceRepository.UpdateAsync(existing, cancellationToken);
                _logger.LogInformation("Updated notification preference for user {UserId}, type {Type}", userId, notificationType);
                return existing;
            }
            else
            {
                // Create new preference
                var preference = new NotificationPreference
                {
                    UserId = userGuid,
                    NotificationType = notificationType,
                    EmailEnabled = emailEnabled,
                    PushEnabled = pushEnabled,
                    SmsEnabled = smsEnabled,
                    InAppEnabled = inAppEnabled,
                    Frequency = frequency,
                    CreatedAt = DateTime.UtcNow
                };

                await _preferenceRepository.AddAsync(preference, cancellationToken);
                _logger.LogInformation("Created notification preference for user {UserId}, type {Type}", userId, notificationType);
                return preference;
            }
        }

        public async Task UpdatePreferencesAsync(string userId, IEnumerable<NotificationPreference> preferences, CancellationToken cancellationToken = default)
        {
            if (!Guid.TryParse(userId, out var userGuid))
            {
                throw new ArgumentException("Invalid user ID", nameof(userId));
            }

            foreach (var preference in preferences)
            {
                await UpsertPreferenceAsync(
                    userId,
                    preference.NotificationType,
                    preference.EmailEnabled,
                    preference.PushEnabled,
                    preference.SmsEnabled,
                    preference.InAppEnabled,
                    preference.Frequency,
                    cancellationToken);
            }

            _logger.LogInformation("Updated {Count} notification preferences for user {UserId}", preferences.Count(), userId);
        }

        public async Task DeletePreferenceAsync(Guid preferenceId, CancellationToken cancellationToken = default)
        {
            var preference = await _preferenceRepository.GetByIdAsync(preferenceId, cancellationToken);
            if (preference != null)
            {
                await _preferenceRepository.DeleteAsync(preference, cancellationToken);
                _logger.LogInformation("Deleted notification preference {PreferenceId}", preferenceId);
            }
        }

        public async Task RegisterDeviceTokenAsync(string userId, string deviceToken, string platform, CancellationToken cancellationToken = default)
        {
            if (!Guid.TryParse(userId, out var userGuid))
            {
                throw new ArgumentException("Invalid user ID", nameof(userId));
            }

            // Check if token already exists
            var allTokens = await _deviceTokenRepository.ListAllAsync(cancellationToken);
            var existing = allTokens.FirstOrDefault(t => t.Token == deviceToken && !t.IsDeleted);

            if (existing != null)
            {
                // Update existing token
                existing.UserId = userGuid;
                existing.Platform = platform;
                existing.IsActive = true;
                existing.LastUsedAt = DateTime.UtcNow;
                existing.UpdatedAt = DateTime.UtcNow;

                await _deviceTokenRepository.UpdateAsync(existing, cancellationToken);
                _logger.LogInformation("Updated device token for user {UserId}, platform {Platform}", userId, platform);
            }
            else
            {
                // Create new token
                var token = new DeviceToken
                {
                    UserId = userGuid,
                    Token = deviceToken,
                    Platform = platform,
                    IsActive = true,
                    LastUsedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };

                await _deviceTokenRepository.AddAsync(token, cancellationToken);
                _logger.LogInformation("Registered device token for user {UserId}, platform {Platform}", userId, platform);
            }
        }

        public async Task UnregisterDeviceTokenAsync(string deviceToken, CancellationToken cancellationToken = default)
        {
            var allTokens = await _deviceTokenRepository.ListAllAsync(cancellationToken);
            var token = allTokens.FirstOrDefault(t => t.Token == deviceToken && !t.IsDeleted);

            if (token != null)
            {
                await _deviceTokenRepository.DeleteAsync(token, cancellationToken);
                _logger.LogInformation("Unregistered device token {Token}", deviceToken);
            }
        }

        public async Task<IEnumerable<string>> GetUserDeviceTokensAsync(string userId, CancellationToken cancellationToken = default)
        {
            if (!Guid.TryParse(userId, out var userGuid))
            {
                return Enumerable.Empty<string>();
            }

            var allTokens = await _deviceTokenRepository.ListAllAsync(cancellationToken);
            return allTokens
                .Where(t => t.UserId == userGuid && t.IsActive && !t.IsDeleted)
                .Select(t => t.Token)
                .ToList();
        }

        public async Task<bool> IsChannelEnabledAsync(string userId, string notificationType, string channel, CancellationToken cancellationToken = default)
        {
            var preference = await GetPreferenceByTypeAsync(userId, notificationType, cancellationToken);

            if (preference == null)
            {
                // Default to enabled if no preference is set
                return true;
            }

            return channel.ToLower() switch
            {
                "email" => preference.EmailEnabled,
                "push" => preference.PushEnabled,
                "sms" => preference.SmsEnabled,
                "inapp" or "in-app" => preference.InAppEnabled,
                _ => true
            };
        }
    }
}
