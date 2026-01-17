# Notification Components

This directory contains notification-related components for the Dashboard application.

## Components

### NotificationContainer

A container component that displays real-time toast notifications using SignalR.

**Features:**
- Real-time notification delivery via SignalR
- Auto-dismiss after 5 seconds
- Manual dismiss option
- Different styles for different notification types (success, error, warning, info)
- Accessible with ARIA attributes

**Usage:**
```tsx
import { NotificationContainer } from '../../components/notification';

function App() {
  return (
    <>
      <NotificationContainer />
      {/* Your app content */}
    </>
  );
}
```

### NotificationPreferences

A comprehensive component for managing user notification preferences across different channels and notification types.

**Features:**
- Enable/disable notifications per channel (Email, Push, SMS, In-App)
- Set notification frequency (Immediate, Daily, Weekly)
- Manage preferences per notification type (System, Marketplace, User, Security, etc.)
- Real-time save with success/error feedback
- Responsive design with mobile support
- Loading and error states
- Accessible with ARIA labels

**Requirements Satisfied:**
- 7.1: Enable/disable email notifications
- 7.2: Enable/disable push notifications
- 7.3: Enable/disable SMS notifications
- 7.4: Enable/disable in-app notifications
- 7.5: Set notification frequency (immediate, daily, weekly)
- 7.6: Configure preferences per notification type
- 7.7: Respect user preferences when sending notifications

**Props:**
```typescript
interface NotificationPreferencesProps {
  userId?: string;           // Optional user ID (defaults to current user)
  onSave?: () => void;       // Callback when preferences are saved
}
```

**Usage:**
```tsx
import { NotificationPreferences } from '../../components/notification';

function SettingsPage() {
  return (
    <NotificationPreferences 
      onSave={() => {
        console.log('Preferences saved!');
      }}
    />
  );
}
```

**Integration Points:**

1. **Settings Page** (`src/pages/settings/components/NotificationSettings.tsx`)
   - Add as a tab in user settings
   - Allows users to manage their own preferences

2. **Administration Page** (`src/pages/administration/notifications/NotificationPreferencesPage.tsx`)
   - Standalone page for admin access
   - Can be extended to manage preferences for other users

3. **Test Page** (`src/pages/test/NotificationPreferencesTest.tsx`)
   - Test and demo page for development

## API Integration

The components use the following services:

- **NotificationPreferenceService** (`src/services/notification/preferences.ts`)
  - `getPreferences()` - Fetch user preferences
  - `updatePreferences(preferences)` - Save preferences
  - `registerDevice(token, platform)` - Register push notification device
  - `unregisterDevice(token)` - Unregister device

- **SignalRManager** (`src/services/notification/signalr.ts`)
  - Real-time notification delivery
  - Automatic reconnection
  - Event subscription

## Type Definitions

All notification types are defined in `src/types/notification/index.ts`:

- `NotificationPreferenceDto` - Preference data structure
- `NotificationType` - Enum for notification types
- `NotificationCategory` - Enum for notification categories
- `NotificationPriority` - Enum for notification priorities

## Styling

Components use:
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- Custom UI components from `src/components/ui`

## Accessibility

All components follow accessibility best practices:
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- Semantic HTML
- Color contrast compliance

## Testing

To test the NotificationPreferences component:

1. Navigate to `/test/notification-preferences`
2. Verify all channels can be toggled
3. Verify frequency can be changed
4. Verify save functionality
5. Verify error handling
6. Verify loading states

## Future Enhancements

Potential improvements:
- Bulk enable/disable all channels
- Import/export preferences
- Notification preview
- Schedule quiet hours
- Custom notification sounds
- Advanced filtering options
