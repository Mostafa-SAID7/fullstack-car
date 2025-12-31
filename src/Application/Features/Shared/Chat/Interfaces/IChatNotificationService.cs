using Application.Features.Shared.Chat.DTOs;

namespace Application.Features.Shared.Chat.Interfaces
{
    public interface IChatNotificationService
    {
        Task NotifyNewMessage(Guid conversationId, ChatMessageDto message);
        Task NotifyTyping(Guid conversationId, Guid userId);
        Task NotifyMessageRead(Guid conversationId, Guid messageId, Guid userId);
    }
}