using Application.Common.Interfaces.Communication;
using Application.Features.Shared.Chat.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace WebAPI.Hubs.Shared
{
    [Authorize]
    public class ChatHub : Hub<IChatHub>
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }
            await base.OnConnectedAsync();
        }

        public async Task JoinConversation(Guid conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        public async Task LeaveConversation(Guid conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        public async Task SendTyping(Guid conversationId)
        {
            var userId = Context.UserIdentifier;
            if (Guid.TryParse(userId, out var userGuid))
            {
                await Clients.Group(conversationId.ToString()).UserTyping(conversationId, userGuid);
            }
        }
    }
}
