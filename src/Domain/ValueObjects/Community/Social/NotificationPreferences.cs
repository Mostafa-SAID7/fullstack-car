using Domain.Base;
using Domain.Enums.Community.Social;
using NotificationType = Domain.Enums.Community.Social.NotificationType;

namespace Domain.ValueObjects.Community.Social
{
    public class NotificationPreferences : ValueObject
    {
        public bool EmailNotifications { get; private set; }
        public bool PushNotifications { get; private set; }
        public bool SmsNotifications { get; private set; }
        public Dictionary<NotificationType, bool> TypePreferences { get; private set; }
        public bool QuietHoursEnabled { get; private set; }
        public TimeSpan QuietHoursStart { get; private set; }
        public TimeSpan QuietHoursEnd { get; private set; }
        public bool WeekendNotifications { get; private set; }

        private NotificationPreferences() 
        {
            TypePreferences = new Dictionary<NotificationType, bool>();
        }

        public NotificationPreferences(
            bool emailNotifications = true,
            bool pushNotifications = true,
            bool smsNotifications = false,
            Dictionary<NotificationType, bool>? typePreferences = null,
            bool quietHoursEnabled = false,
            TimeSpan? quietHoursStart = null,
            TimeSpan? quietHoursEnd = null,
            bool weekendNotifications = true)
        {
            EmailNotifications = emailNotifications;
            PushNotifications = pushNotifications;
            SmsNotifications = smsNotifications;
            TypePreferences = typePreferences ?? CreateDefaultTypePreferences();
            QuietHoursEnabled = quietHoursEnabled;
            QuietHoursStart = quietHoursStart ?? new TimeSpan(22, 0, 0); // 10 PM
            QuietHoursEnd = quietHoursEnd ?? new TimeSpan(8, 0, 0); // 8 AM
            WeekendNotifications = weekendNotifications;
        }

        public static NotificationPreferences CreateDefault()
        {
            return new NotificationPreferences();
        }

        public static NotificationPreferences CreateMinimal()
        {
            var minimalPreferences = new Dictionary<NotificationType, bool>();
            foreach (NotificationType type in Enum.GetValues<NotificationType>())
            {
                minimalPreferences[type] = type == NotificationType.DirectMessage || 
                                         type == NotificationType.FriendRequest;
            }

            return new NotificationPreferences(
                emailNotifications: false,
                pushNotifications: true,
                smsNotifications: false,
                typePreferences: minimalPreferences,
                quietHoursEnabled: true,
                weekendNotifications: false);
        }

        private static Dictionary<NotificationType, bool> CreateDefaultTypePreferences()
        {
            var preferences = new Dictionary<NotificationType, bool>();
            foreach (NotificationType type in Enum.GetValues<NotificationType>())
            {
                preferences[type] = true;
            }
            return preferences;
        }

        public NotificationPreferences UpdateEmailNotifications(bool enabled)
        {
            return new NotificationPreferences(
                enabled, PushNotifications, SmsNotifications, TypePreferences,
                QuietHoursEnabled, QuietHoursStart, QuietHoursEnd, WeekendNotifications);
        }

        public NotificationPreferences UpdatePushNotifications(bool enabled)
        {
            return new NotificationPreferences(
                EmailNotifications, enabled, SmsNotifications, TypePreferences,
                QuietHoursEnabled, QuietHoursStart, QuietHoursEnd, WeekendNotifications);
        }

        public NotificationPreferences UpdateTypePreference(NotificationType type, bool enabled)
        {
            var newPreferences = new Dictionary<NotificationType, bool>(TypePreferences)
            {
                [type] = enabled
            };

            return new NotificationPreferences(
                EmailNotifications, PushNotifications, SmsNotifications, newPreferences,
                QuietHoursEnabled, QuietHoursStart, QuietHoursEnd, WeekendNotifications);
        }

        public NotificationPreferences UpdateQuietHours(bool enabled, TimeSpan? start = null, TimeSpan? end = null)
        {
            return new NotificationPreferences(
                EmailNotifications, PushNotifications, SmsNotifications, TypePreferences,
                enabled, start ?? QuietHoursStart, end ?? QuietHoursEnd, WeekendNotifications);
        }

        public bool IsNotificationAllowed(NotificationType type, DateTime currentTime)
        {
            // Check if this notification type is enabled
            if (!TypePreferences.TryGetValue(type, out bool typeEnabled) || !typeEnabled)
                return false;

            // Check quiet hours
            if (QuietHoursEnabled)
            {
                var currentTimeOfDay = currentTime.TimeOfDay;
                if (IsInQuietHours(currentTimeOfDay))
                    return false;
            }

            // Check weekend notifications
            if (!WeekendNotifications && (currentTime.DayOfWeek == DayOfWeek.Saturday || currentTime.DayOfWeek == DayOfWeek.Sunday))
                return false;

            return true;
        }

        private bool IsInQuietHours(TimeSpan currentTime)
        {
            if (QuietHoursStart <= QuietHoursEnd)
            {
                // Same day quiet hours (e.g., 10 PM to 8 AM next day)
                return currentTime >= QuietHoursStart || currentTime <= QuietHoursEnd;
            }
            else
            {
                // Cross-day quiet hours (e.g., 8 PM to 6 AM)
                return currentTime >= QuietHoursStart && currentTime <= QuietHoursEnd;
            }
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return EmailNotifications;
            yield return PushNotifications;
            yield return SmsNotifications;
            yield return QuietHoursEnabled;
            yield return QuietHoursStart;
            yield return QuietHoursEnd;
            yield return WeekendNotifications;
            
            foreach (var kvp in TypePreferences.OrderBy(x => x.Key))
            {
                yield return kvp.Key;
                yield return kvp.Value;
            }
        }
    }
}