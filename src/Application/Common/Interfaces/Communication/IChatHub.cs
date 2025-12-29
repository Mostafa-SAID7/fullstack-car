using Application.Features.Shared.Chat.DTOs;

namespace Application.Common.Interfaces.Communication
{
    public interface IChatHub
    {
        Task ReceiveMessage(ChatMessageDto message);
        Task UserTyping(Guid conversationId, Guid userId);
        Task MessageRead(Guid conversationId, Guid messageId, Guid userId);
    }
}
