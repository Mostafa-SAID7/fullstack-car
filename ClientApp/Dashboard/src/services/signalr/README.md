# SignalR Integration Guide

This guide explains how to use SignalR for real-time updates in the Dashboard application.

## Overview

The SignalR integration provides real-time communication between the backend and Dashboard frontend. It's already configured and ready to use through the `SignalRProvider` context.

## Architecture

```
SignalRService (Core Service)
    ↓
SignalRContext (React Context)
    ↓
useSignalR Hook (React Hook)
    ↓
Components (Your Code)
```

## Setup

The SignalR connection is automatically established when the app starts. The `SignalRProvider` is already integrated in `App.tsx`:

```tsx
<SignalRProvider>
  <YourApp />
</SignalRProvider>
```

## Configuration

The SignalR hub URL is configured in `src/config/api/index.ts`:

```typescript
export const SIGNALR_HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL || 'http://localhost:5100/hubs/community';
```

You can override this by setting the `VITE_SIGNALR_HUB_URL` environment variable.

## Usage in Components

### Basic Usage

```tsx
import { useSignalR } from '@/hooks/useSignalR';

function MyComponent() {
  const { on, connectionStatus, isConnected } = useSignalR();

  useEffect(() => {
    // Subscribe to an event
    const unsubscribe = on('PostCreated', (post) => {
      console.log('New post created:', post);
      // Update your component state
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [on]);

  return (
    <div>
      <p>Connection Status: {connectionStatus}</p>
      {/* Your component content */}
    </div>
  );
}
```

### Real-time List Updates

Example: Automatically refresh posts when a new post is created:

```tsx
import { useSignalR } from '@/hooks/useSignalR';
import { usePosts } from '../hooks/usePosts';

function PostsList() {
  const { posts, loading, refetch } = usePosts();
  const { on } = useSignalR();

  useEffect(() => {
    // Refresh list when new post is created
    const unsubscribeCreated = on('PostCreated', () => {
      refetch();
    });

    // Refresh list when post is updated
    const unsubscribeUpdated = on('PostUpdated', () => {
      refetch();
    });

    // Refresh list when post is deleted
    const unsubscribeDeleted = on('PostDeleted', () => {
      refetch();
    });

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [on, refetch]);

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Real-time Counter Updates

Example: Update like counts in real-time:

```tsx
import { useSignalR } from '@/hooks/useSignalR';

function PostCard({ post }) {
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const { on } = useSignalR();

  useEffect(() => {
    const unsubscribe = on('PostLiked', (data) => {
      if (data.postId === post.id) {
        setLikesCount(data.likesCount);
      }
    });

    return () => unsubscribe();
  }, [on, post.id]);

  return (
    <div>
      <h3>{post.title}</h3>
      <p>Likes: {likesCount}</p>
    </div>
  );
}
```

### Toast Notifications

Example: Show toast notifications for real-time events:

```tsx
import { useSignalR } from '@/hooks/useSignalR';
import { toast } from 'react-hot-toast';

function NotificationListener() {
  const { on } = useSignalR();

  useEffect(() => {
    const unsubscribe = on('NotificationReceived', (notification) => {
      toast.success(notification.message);
    });

    return () => unsubscribe();
  }, [on]);

  return null; // This is a listener component
}
```

## Available Events

### Post Events
- `PostCreated` - New post created
- `PostUpdated` - Post updated
- `PostDeleted` - Post deleted (data: `{ postId: string }`)
- `PostLiked` - Post liked (data: `{ postId: string, likesCount: number }`)
- `PostCommented` - New comment on post (data: `{ postId: string, commentsCount: number }`)

### Group Events
- `GroupCreated` - New group created
- `GroupUpdated` - Group updated
- `GroupMemberJoined` - Member joined group (data: `{ groupId: string, membersCount: number }`)
- `GroupMemberLeft` - Member left group (data: `{ groupId: string, membersCount: number }`)

### Friend Events
- `FriendRequestReceived` - New friend request
- `FriendRequestAccepted` - Friend request accepted (data: `{ friendId: string }`)
- `FriendRequestRejected` - Friend request rejected (data: `{ friendId: string }`)

### Review Events
- `ReviewCreated` - New review created
- `ReviewUpdated` - Review updated
- `ReviewMarkedHelpful` - Review marked helpful (data: `{ reviewId: string, helpfulCount: number }`)

### Guide Events
- `GuideCreated` - New guide created
- `GuideUpdated` - Guide updated
- `GuideBookmarked` - Guide bookmarked (data: `{ guideId: string, bookmarksCount: number }`)

### Article Events
- `ArticlePublished` - New article published
- `ArticleUpdated` - Article updated
- `ArticleLiked` - Article liked (data: `{ articleId: string, likesCount: number }`)

### Location Events
- `LocationCheckIn` - User checked in (data: `{ locationId: string, checkInsCount: number }`)
- `LocationReviewed` - Location reviewed (data: `{ locationId: string, reviewsCount: number }`)

### Page Events
- `PagePublished` - New page published
- `PageUpdated` - Page updated

### QA Events
- `QuestionCreated` - New question created
- `AnswerCreated` - New answer created
- `AnswerAccepted` - Answer accepted (data: `{ answerId: string, questionId: string }`)
- `VoteCreated` - Vote created (data: `{ contentId: string, contentType: string, voteScore: number }`)

### General Events
- `NotificationReceived` - General notification

## Connection Status

The `useSignalR` hook provides connection status information:

```tsx
const { connectionStatus, isConnected } = useSignalR();

// connectionStatus values:
// - 'Disconnected'
// - 'Connecting'
// - 'Connected'
// - 'Reconnecting'
// - 'Failed'

// isConnected is a boolean shorthand
```

## Invoking Hub Methods

You can also invoke methods on the SignalR hub:

```tsx
const { invoke } = useSignalR();

async function joinGroup(groupId: string) {
  try {
    await invoke('JoinGroup', groupId);
    console.log('Joined group successfully');
  } catch (error) {
    console.error('Failed to join group:', error);
  }
}
```

## Error Handling

The SignalR service automatically handles reconnection with exponential backoff. Connection errors are logged to the console.

You can monitor connection status in your components:

```tsx
const { connectionStatus } = useSignalR();

if (connectionStatus === 'Failed') {
  return <div>Connection failed. Please refresh the page.</div>;
}

if (connectionStatus === 'Reconnecting') {
  return <div>Reconnecting...</div>;
}
```

## Best Practices

1. **Always unsubscribe**: Return the unsubscribe function from `useEffect` to prevent memory leaks
2. **Dependency arrays**: Include `on` in your dependency array when using it in `useEffect`
3. **Specific events**: Subscribe to specific events rather than all events
4. **Debounce updates**: For high-frequency events, consider debouncing state updates
5. **Error boundaries**: Wrap SignalR-dependent components in error boundaries

## Example: Complete Integration

Here's a complete example showing best practices:

```tsx
import React, { useState, useEffect } from 'react';
import { useSignalR } from '@/hooks/useSignalR';
import { usePosts } from '../hooks/usePosts';
import { toast } from 'react-hot-toast';

function PostsManagement() {
  const { posts, loading, refetch } = usePosts();
  const { on, connectionStatus, isConnected } = useSignalR();
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);

  useEffect(() => {
    if (!realtimeEnabled) return;

    // Subscribe to multiple events
    const unsubscribers = [
      on('PostCreated', (post) => {
        toast.success(`New post: ${post.title}`);
        refetch();
      }),
      on('PostUpdated', (post) => {
        toast.info(`Post updated: ${post.title}`);
        refetch();
      }),
      on('PostDeleted', ({ postId }) => {
        toast.error('Post deleted');
        refetch();
      })
    ];

    // Cleanup all subscriptions
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [on, refetch, realtimeEnabled]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1>Posts Management</h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={realtimeEnabled}
              onChange={(e) => setRealtimeEnabled(e.target.checked)}
            />
            Real-time updates
          </label>
          <span className={`px-2 py-1 rounded text-sm ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {connectionStatus}
          </span>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
```

## Troubleshooting

### Connection not establishing
- Check that the backend SignalR hub is running
- Verify the `VITE_SIGNALR_HUB_URL` environment variable
- Check browser console for connection errors
- Ensure authentication token is valid

### Events not received
- Verify the event name matches exactly (case-sensitive)
- Check that the backend is emitting the event
- Ensure you're subscribed before the event is emitted
- Check browser console for SignalR logs

### Memory leaks
- Always return the unsubscribe function from `useEffect`
- Don't create new subscriptions on every render
- Use proper dependency arrays in `useEffect`

## Testing

For testing components that use SignalR, you can mock the `useSignalR` hook:

```tsx
jest.mock('@/hooks/useSignalR', () => ({
  useSignalR: () => ({
    on: jest.fn(() => jest.fn()),
    invoke: jest.fn(),
    connectionStatus: 'Connected',
    isConnected: true
  })
}));
```
