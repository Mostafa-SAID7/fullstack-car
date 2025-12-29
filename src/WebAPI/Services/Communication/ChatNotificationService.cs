using Application.Common.Interfaces.Communication;
using Application.Features.Shared.Chat.DTOs;
using Microsoft.AspNetCore.SignalR;
using WebAPI.Hubs.Shared;

namespace WebAPI.Services.Communication
{
    public class ChatNotificationService : IChatNotificationService
    {
        private readonly IHubContext<ChatHub, IChatHub> _hubContext;

        public ChatNotificationService(IHubContext<ChatHub, IChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyNewMessage(Guid conversationId, ChatMessageDto message)
        {
            await _hubContext.Clients.Group(conversationId.ToString()).ReceiveMessage(message);
        }

        public async Task NotifyTyping(Guid conversationId, Guid userId)
        {
            await _hubContext.Clients.Group(conversationId.ToString()).UserTyping(conversationId, userId);
        }

        public async Task NotifyMessageRead(Guid conversationId, Guid messageId, Guid userId)
        {
            await _hubContext.Clients.Group(conversationId.ToString()).MessageRead(conversationId, messageId, userId);
        }
    }
}
