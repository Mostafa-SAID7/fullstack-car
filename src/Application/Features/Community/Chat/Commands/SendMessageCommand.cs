using Application.Common.Interfaces.Communication;
using Application.Common.Models;
using Application.Features.Community.Chat.DTOs;
using Domain.Entities.Community.Chat;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Chat.Commands
{
    public class SendMessageCommand : IRequest<Result<ChatMessageDto>>
    {
        public Guid UserId { get; set; }
        public SendMessageRequest Request { get; set; } = null!;
    }

    public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, Result<ChatMessageDto>>
    {
        private readonly IRepository<Conversation> _conversationRepository;
        private readonly IRepository<ChatMessage> _messageRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IChatNotificationService _chatNotificationService;

        public SendMessageCommandHandler(
            IRepository<Conversation> conversationRepository,
            IRepository<ChatMessage> messageRepository,
            IRepository<User> userRepository,
            IUnitOfWork unitOfWork,
            IChatNotificationService chatNotificationService)
        {
            _conversationRepository = conversationRepository;
            _messageRepository = messageRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _chatNotificationService = chatNotificationService;
        }

        public async Task<Result<ChatMessageDto>> Handle(SendMessageCommand request, CancellationToken cancellationToken)
        {
            var conversation = await _conversationRepository.GetByIdAsync(request.Request.ConversationId, cancellationToken);
            if (conversation == null)
            {
                return Result<ChatMessageDto>.Failure(new[] { "Conversation not found" });
            }

            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken);
            var userName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown";

            var message = new ChatMessage
            {
                ConversationId = request.Request.ConversationId,
                SenderId = request.UserId,
                Content = request.Request.Content,
                Type = (MessageType)request.Request.Type,
                CreatedAt = DateTime.UtcNow
            };

            await _messageRepository.AddAsync(message, cancellationToken);

            conversation.LastMessageId = message.Id;
            conversation.LastMessageAt = message.CreatedAt;
            await _conversationRepository.UpdateAsync(conversation, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var dto = new ChatMessageDto
            {
                Id = message.Id,
                ConversationId = message.ConversationId,
                SenderId = message.SenderId,
                SenderName = userName,
                Content = message.Content,
                SentAt = message.CreatedAt,
                IsRead = false,
                Type = (int)message.Type
            };

            // Broadcast to the SignalR group
            await _chatNotificationService.NotifyNewMessage(message.ConversationId, dto);

            return Result<ChatMessageDto>.Success(dto);
        }
    }
}
