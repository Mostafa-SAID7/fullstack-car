namespace Application.Features.Community.Chat.DTOs
{
    public class ChatMessageDto
    {
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public Guid SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
        public int Type { get; set; }
    }

    public class ConversationDto
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public bool IsGroup { get; set; }
        public ChatMessageDto? LastMessage { get; set; }
        public List<ConversationMemberDto> Members { get; set; } = new();
        public int UnreadCount { get; set; }
    }

    public class ConversationMemberDto
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string? UserImageUrl { get; set; }
        public DateTime? LastReadAt { get; set; }
    }

    public class SendMessageRequest
    {
        public Guid ConversationId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int Type { get; set; } = 1;
    }

    public class CreateConversationRequest
    {
        public List<Guid> ParticipantIds { get; set; } = new();
        public string? Title { get; set; }
        public bool IsGroup { get; set; }
    }
}
