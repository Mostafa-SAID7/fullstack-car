using Application.Features.Shared.Chat.DTOs;

namespace Application.Common.Interfaces.Communication
{
    public interface IChatNotificationService
    {
        Task NotifyNewMessage(Guid conversationId, ChatMessageDto message);
        Task NotifyTyping(Guid conversationId, Guid userId);
        Task NotifyMessageRead(Guid conversationId, Guid messageId, Guid userId);
    }
}
