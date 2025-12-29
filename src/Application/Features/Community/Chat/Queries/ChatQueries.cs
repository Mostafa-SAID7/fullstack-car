using Application.Common.Models;
using Application.Features.Community.Chat.DTOs;
using Domain.Entities.Community.Chat;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Community.Chat.Queries
{
    public class GetConversationsQuery : IRequest<Result<List<ConversationDto>>>
    {
        public Guid UserId { get; set; }
    }

    public class GetChatHistoryQuery : IRequest<Result<List<ChatMessageDto>>>
    {
        public Guid ConversationId { get; set; }
        public int PageSize { get; set; } = 50;
        public DateTime? Before { get; set; }
    }

    public class ChatQueriesHandler :
        IRequestHandler<GetConversationsQuery, Result<List<ConversationDto>>>,
        IRequestHandler<GetChatHistoryQuery, Result<List<ChatMessageDto>>>
    {
        private readonly IRepository<Conversation> _conversationRepository;
        private readonly IRepository<ChatMessage> _messageRepository;
        private readonly IRepository<ConversationMember> _memberRepository;

        public ChatQueriesHandler(
            IRepository<Conversation> conversationRepository,
            IRepository<ChatMessage> messageRepository,
            IRepository<ConversationMember> memberRepository)
        {
            _conversationRepository = conversationRepository;
            _messageRepository = messageRepository;
            _memberRepository = memberRepository;
        }

        public async Task<Result<List<ConversationDto>>> Handle(GetConversationsQuery request, CancellationToken cancellationToken)
        {
            // Simplified query logic
            var memberships = await _memberRepository.ListAllAsync(cancellationToken);
            var conversationIds = memberships.Where(m => m.UserId == request.UserId).Select(m => m.ConversationId).ToList();

            var conversations = await _conversationRepository.ListAllAsync(cancellationToken);
            var result = conversations
                .Where(c => conversationIds.Contains(c.Id))
                .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
                .Select(c => new ConversationDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    IsGroup = c.IsGroup,
                    UnreadCount = 0 // Needs proper tracking
                })
                .ToList();

            return Result<List<ConversationDto>>.Success(result);
        }

        public async Task<Result<List<ChatMessageDto>>> Handle(GetChatHistoryQuery request, CancellationToken cancellationToken)
        {
            var messages = await _messageRepository.ListAllAsync(cancellationToken);
            var result = messages
                .Where(m => m.ConversationId == request.ConversationId)
                .OrderByDescending(m => m.CreatedAt)
                .Take(request.PageSize)
                .Select(m => new ChatMessageDto
                {
                    Id = m.Id,
                    ConversationId = m.ConversationId,
                    SenderId = m.SenderId,
                    Content = m.Content,
                    SentAt = m.CreatedAt,
                    IsRead = false,
                    Type = (int)m.Type
                })
                .OrderBy(m => m.SentAt)
                .ToList();

            return Result<List<ChatMessageDto>>.Success(result);
        }
    }
}
