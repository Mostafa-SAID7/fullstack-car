using Application.Features.Shared.Chat.Interfaces;
using Application.Features.Shared.Chat.DTOs;

namespace Application.Features.Shared.Chat.Services
{
    public class ChatNotificationService : IChatNotificationService
    {
        // TODO: Implement SignalR hub context injection when Infrastructure layer is ready
        // private readonly IHubContext<ChatHub, IChatHub> _hubContext;

        public ChatNotificationService()
        {
            // _hubContext = hubContext;
        }

        public async Task NotifyNewMessage(Guid conversationId, ChatMessageDto message)
        {
            // TODO: Implement SignalR hub context injection when Infrastructure layer is ready
            // await _hubContext.Clients.Group(conversationId.ToString()).ReceiveMessage(message);
            await Task.CompletedTask;
        }

        public async Task NotifyTyping(Guid conversationId, Guid userId)
        {
            // TODO: Implement SignalR hub context injection when Infrastructure layer is ready
            // await _hubContext.Clients.Group(conversationId.ToString()).UserTyping(conversationId, userId);
            await Task.CompletedTask;
        }

        public async Task NotifyMessageRead(Guid conversationId, Guid messageId, Guid userId)
        {
            // TODO: Implement SignalR hub context injection when Infrastructure layer is ready
            // await _hubContext.Clients.Group(conversationId.ToString()).MessageRead(conversationId, messageId, userId);
            await Task.CompletedTask;
        }
    }
}
