# QA System SignalR Hub Documentation

## Overview

The QA Hub (`QAHub`) provides unified real-time communication for the Question and Answer system, serving both Angular Main App and React Dashboard clients. It eliminates code duplication by providing a single SignalR hub that handles all QA-related real-time features.

## Hub Endpoint

```
/hubs/qa
```

## Features

### 1. Connection Management
- Automatic user group assignment based on authentication
- Connection health monitoring with ping/pong
- Graceful reconnection handling

### 2. Question Management
- Join/leave specific question groups for real-time updates
- Receive notifications about question updates, closures, and status changes

### 3. Category and Expert Management
- Join/leave category groups for expert notifications
- Expert-specific groups for priority notifications
- Moderator groups for administrative features

### 4. Real-time Notifications
- New answer notifications
- Vote updates (upvotes/downvotes)
- Answer acceptance notifications
- Reputation changes and badge awards
- Typing indicators during answer composition

## Client Usage Examples

### Angular Client (TypeScript)

```typescript
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

export class QAHubService {
  private hubConnection: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('/hubs/qa', {
        accessTokenFactory: () => this.getAuthToken()
      })
      .withAutomaticReconnect()
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // Listen for new answers
    this.hubConnection.on('ReceiveNewAnswer', (answer) => {
      console.log('New answer received:', answer);
      // Update UI with new answer
    });

    // Listen for vote updates
    this.hubConnection.on('ReceiveVoteUpdate', (voteUpdate) => {
      console.log('Vote update received:', voteUpdate);
      // Update vote counts in UI
    });

    // Listen for typing indicators
    this.hubConnection.on('ReceiveTypingIndicator', (typingIndicator) => {
      console.log('User typing:', typingIndicator);
      // Show/hide typing indicator
    });
  }

  async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      console.log('QA Hub connection started');
    } catch (error) {
      console.error('Error starting QA Hub connection:', error);
    }
  }

  async joinQuestion(questionId: string): Promise<void> {
    try {
      await this.hubConnection.invoke('JoinQuestion', questionId);
    } catch (error) {
      console.error('Error joining question:', error);
    }
  }

  async sendTypingIndicator(questionId: string, isTyping: boolean): Promise<void> {
    try {
      await this.hubConnection.invoke('SendTypingIndicator', questionId, isTyping);
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }
}
```

### React Client (TypeScript)

```typescript
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';

export const useQAHub = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('/hubs/qa', {
        accessTokenFactory: () => getAuthToken()
      })
      .withAutomaticReconnect()
      .build();

    // Setup event handlers
    newConnection.on('ReceiveNewAnswer', (answer) => {
      // Handle new answer in React state
      console.log('New answer:', answer);
    });

    newConnection.on('ReceiveVoteUpdate', (voteUpdate) => {
      // Update vote counts in React state
      console.log('Vote update:', voteUpdate);
    });

    newConnection.on('ReceiveReputationUpdate', (reputationUpdate) => {
      // Update user reputation in React state
      console.log('Reputation update:', reputationUpdate);
    });

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  const startConnection = async () => {
    if (connection) {
      try {
        await connection.start();
        setIsConnected(true);
        console.log('QA Hub connected');
      } catch (error) {
        console.error('QA Hub connection failed:', error);
      }
    }
  };

  const joinModeratorsGroup = async () => {
    if (connection && isConnected) {
      try {
        await connection.invoke('JoinModeratorsGroup');
      } catch (error) {
        console.error('Error joining moderators group:', error);
      }
    }
  };

  return {
    connection,
    isConnected,
    startConnection,
    joinModeratorsGroup
  };
};
```

## Hub Methods

### Connection Methods
- `JoinQuestion(questionId: Guid)` - Join a question's group for real-time updates
- `LeaveQuestion(questionId: Guid)` - Leave a question's group
- `JoinCategory(category: string)` - Join a category for new question notifications
- `LeaveCategory(category: string)` - Leave a category
- `JoinExpertsGroup()` - Join the experts group (for expert users)
- `JoinModeratorsGroup()` - Join the moderators group (for admin dashboard)
- `Ping()` - Health check method, returns "Pong" with timestamp

### Real-time Communication
- `SendTypingIndicator(questionId: Guid, isTyping: bool)` - Send typing status while composing answers

## Event Handlers (Client-side)

### Answer Events
- `ReceiveNewAnswer(answer: AnswerDto)` - New answer posted to a question
- `ReceiveAnswerAccepted(answerAccepted: AnswerAcceptedDto)` - Answer was accepted

### Voting Events
- `ReceiveVoteUpdate(voteUpdate: VoteUpdateDto)` - Vote counts changed

### Question Events
- `ReceiveQuestionUpdate(question: QuestionDto)` - Question was updated or closed
- `ReceiveQuestionClosed(questionClosed: QuestionClosedDto)` - Question was closed

### User Events
- `ReceiveReputationUpdate(reputationUpdate: ReputationUpdateDto)` - User reputation changed
- `ReceiveExpertNotification(expertNotification: ExpertNotificationDto)` - New question in expert's area

### System Events
- `ReceiveTypingIndicator(typingIndicator: TypingIndicatorDto)` - Someone is typing an answer
- `ReceiveConnectionStatus(connectionStatus: ConnectionStatusDto)` - Connection status updates

## Backend Integration

### Using QAHubService in Controllers

```csharp
[ApiController]
public class AnswersController : BaseController
{
    private readonly IQAHubService _qaHubService;

    public AnswersController(IQAHubService qaHubService)
    {
        _qaHubService = qaHubService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAnswer([FromBody] CreateAnswerRequest request)
    {
        var result = await Mediator.Send(new CreateAnswerCommand(request));

        if (result.Succeeded)
        {
            // Send real-time notification
            await _qaHubService.NotifyNewAnswerAsync(result.Data);
            return Ok(result.Data);
        }

        return BadRequest(result.Errors);
    }
}
```

### Using QAHubService in Domain Event Handlers

```csharp
public class AnswerCreatedEventHandler : INotificationHandler<AnswerCreatedEvent>
{
    private readonly IQAHubService _qaHubService;

    public AnswerCreatedEventHandler(IQAHubService qaHubService)
    {
        _qaHubService = qaHubService;
    }

    public async Task Handle(AnswerCreatedEvent notification, CancellationToken cancellationToken)
    {
        var answerDto = MapToDto(notification.Answer);
        await _qaHubService.NotifyNewAnswerAsync(answerDto);
    }
}
```

## Security

- All hub methods require authentication (`[Authorize]` attribute)
- User context is automatically available through `Context.User`
- Group membership is managed automatically based on user authentication
- Connection state is tracked per user for security and cleanup

## Error Handling

- Hub methods include try-catch blocks with logging
- Failed real-time notifications don't break core functionality
- Automatic reconnection is handled by SignalR client libraries
- Connection health can be monitored using the `Ping()` method

## Performance Considerations

- Groups are used efficiently to target specific audiences
- Notifications are sent only to relevant users (question viewers, category followers, etc.)
- Connection pooling is handled automatically by SignalR
- Message serialization is optimized for both Angular and React clients

## Testing

Unit tests are provided in `tests/Infrastructure.UnitTests/QA/QAHubServiceTests.cs` covering:
- New answer notifications
- Vote update notifications
- Answer acceptance notifications
- Reputation update notifications
- Expert notifications
- Connection status broadcasts

## Deployment Notes

- Ensure SignalR is properly configured in `Program.cs`
- Hub endpoint `/hubs/qa` must be accessible to both Angular and React clients
- Consider using Redis backplane for multi-server deployments
- Monitor connection counts and performance in production