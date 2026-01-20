using Application.Common.Models;
using Application.Features.Shared.Chat.DTOs;
using Domain.Entities.Messaging;
using Domain.Entities.Identity;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Shared.Chat.Commands
{
    public class CreateConversationCommand : IRequest<Result<ConversationDto>>
    {
        public Guid UserId { get; set; }
        public CreateConversationRequest Request { get; set; } = null!;
    }

    public class CreateConversationCommandHandler : IRequestHandler<CreateConversationCommand, Result<ConversationDto>>
    {
        private readonly IRepository<Conversation> _conversationRepository;
        private readonly IRepository<ConversationMember> _memberRepository;
        private readonly IRepository<ApplicationUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateConversationCommandHandler(
            IRepository<Conversation> conversationRepository,
            IRepository<ConversationMember> memberRepository,
            IRepository<ApplicationUser> userRepository,
            IUnitOfWork unitOfWork)
        {
            _conversationRepository = conversationRepository;
            _memberRepository = memberRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<ConversationDto>> Handle(CreateConversationCommand request, CancellationToken cancellationToken)
        {
            // If it's a private chat, check if it already exists
            if (!request.Request.IsGroup && request.Request.ParticipantIds.Count == 1)
            {
                var otherUserId = request.Request.ParticipantIds[0];
                var existing = (await _conversationRepository.GetAllAsync(cancellationToken))
                    .FirstOrDefault(c => !c.IsGroup &&
                                        c.Members.Any(m => m.UserId == request.UserId) &&
                                        c.Members.Any(m => m.UserId == otherUserId));

                if (existing != null)
                {
                    return Result<ConversationDto>.Success(new ConversationDto { Id = existing.Id });
                }
            }

            var conversation = new Conversation
            {
                Title = request.Request.Title,
                IsGroup = request.Request.IsGroup,
                CreatedAt = DateTime.UtcNow
            };

            await _conversationRepository.AddAsync(conversation, cancellationToken);

            var allParticipantIds = new HashSet<Guid>(request.Request.ParticipantIds) { request.UserId };
            foreach (var participantId in allParticipantIds)
            {
                var member = new ConversationMember
                {
                    ConversationId = conversation.Id,
                    UserId = participantId,
                    JoinedAt = DateTime.UtcNow
                };
                await _memberRepository.AddAsync(member, cancellationToken);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<ConversationDto>.Success(new ConversationDto
            {
                Id = conversation.Id,
                Title = conversation.Title,
                IsGroup = conversation.IsGroup
            });
        }
    }
}
