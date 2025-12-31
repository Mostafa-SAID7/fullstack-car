using Application.Features.Shared.Chat.DTOs;

namespace Application.Features.Shared.Chat.Interfaces
{
    public interface IChatHub
    {
        Task ReceiveMessage(ChatMessageDto message);
        Task UserTyping(Guid conversationId, Guid userId);
        Task MessageRead(Guid conversationId, Guid messageId, Guid userId);
    }
}