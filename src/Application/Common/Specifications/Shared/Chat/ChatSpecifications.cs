using Application.Common.Specifications;
using Domain.Entities.Shared.Chat;

namespace Application.Common.Specifications.Shared.Chat
{
    public class ConversationsByUserSpecification : BaseSpecification<Conversation>
    {
        public ConversationsByUserSpecification(Guid userId)
            : base(c => c.Members.Any(m => m.UserId == userId))
        {
            AddInclude(c => c.Members);
            AddInclude("Messages"); // Include messages for last message retrieval
        }
    }

    public class ChatMessagesByConversationSpecification : BaseSpecification<ChatMessage>
    {
        public ChatMessagesByConversationSpecification(Guid conversationId, int pageSize, DateTime? before = null)
            : base(m => m.ConversationId == conversationId && (!before.HasValue || m.CreatedAt < before.Value))
        {
            ApplyPaging(0, pageSize);
            ApplyOrderByDescending(m => m.CreatedAt);
        }
    }

    public class ConversationMembersSpecification : BaseSpecification<ConversationMember>
    {
        public ConversationMembersSpecification(Guid conversationId)
            : base(m => m.ConversationId == conversationId)
        {
            AddInclude(m => m.User);
        }
    }
}