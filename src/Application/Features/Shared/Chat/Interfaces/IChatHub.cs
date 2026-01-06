namespace Application.Features.Shared.Chat.Interfaces;

public interface IChatHub
{
    Task ReceiveMessage(string user, string message);
    Task UserJoined(string user);
    Task UserLeft(string user);
    Task TypingStarted(string user);
    Task TypingStopped(string user);
    Task UserTyping(Guid conversationId, Guid userId);
}
