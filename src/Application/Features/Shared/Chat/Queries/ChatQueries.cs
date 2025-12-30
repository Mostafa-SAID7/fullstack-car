using Application.Common.Models;
using Application.Features.Shared.Chat.DTOs;
using Domain.Entities.Shared.Chat;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Enums.Shared.Chat;
using Domain.Specifications.Shared.Chat;

namespace Application.Features.Shared.Chat.Queries
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
        private readonly IRepository<ApplicationUser> _userRepository;

        public ChatQueriesHandler(
            IRepository<Conversation> conversationRepository,
            IRepository<ChatMessage> messageRepository,
            IRepository<ConversationMember> memberRepository,
            IRepository<ApplicationUser> userRepository)
        {
            _conversationRepository = conversationRepository;
            _messageRepository = messageRepository;
            _memberRepository = memberRepository;
            _userRepository = userRepository;
        }

        public async Task<Result<List<ConversationDto>>> Handle(GetConversationsQuery request, CancellationToken cancellationToken)
        {
            var spec = new ConversationsByUserSpecification(request.UserId);
            var conversations = await _conversationRepository.ListAsync(spec, cancellationToken);

            var result = conversations.Select(c =>
            {
                var userMembership = c.Members.First(m => m.UserId == request.UserId);
                var lastMessage = c.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault();

                var unreadCount = c.Messages.Count(m => m.SenderId != request.UserId &&
                                                       m.CreatedAt > (userMembership.LastReadAt ?? DateTime.MinValue));

                return new ConversationDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    IsGroup = c.IsGroup,
                    UnreadCount = unreadCount,
                    LastMessage = lastMessage != null ? new ChatMessageDto
                    {
                        Id = lastMessage.Id,
                        ConversationId = lastMessage.ConversationId,
                        Content = lastMessage.Content,
                        SentAt = lastMessage.CreatedAt,
                        SenderId = lastMessage.SenderId,
                        Type = (int)lastMessage.Type
                    } : null
                };
            })
            .OrderByDescending(c => c.LastMessage?.SentAt ?? DateTime.MinValue)
            .ToList();

            return Result<List<ConversationDto>>.Success(result);
        }

        public async Task<Result<List<ChatMessageDto>>> Handle(GetChatHistoryQuery request, CancellationToken cancellationToken)
        {
            var spec = new ChatMessagesByConversationSpecification(request.ConversationId, request.PageSize, request.Before);
            var messages = await _messageRepository.ListAsync(spec, cancellationToken);

            var result = messages
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
