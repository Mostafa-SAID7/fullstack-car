using Application.Features.Shared.Chat.Interfaces;
using Application.Common.Models;
using Domain.Entities.Shared.Chat;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Shared.Chat.Commands
{
    public class MarkConversationAsReadCommand : IRequest<Result<bool>>
    {
        public Guid UserId { get; set; }
        public Guid ConversationId { get; set; }
    }

    public class MarkConversationAsReadCommandHandler : IRequestHandler<MarkConversationAsReadCommand, Result<bool>>
    {
        private readonly IRepository<ConversationMember> _memberRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IChatNotificationService _chatNotificationService;

        public MarkConversationAsReadCommandHandler(
            IRepository<ConversationMember> memberRepository,
            IUnitOfWork unitOfWork,
            IChatNotificationService chatNotificationService)
        {
            _memberRepository = memberRepository;
            _unitOfWork = unitOfWork;
            _chatNotificationService = chatNotificationService;
        }

        public async Task<Result<bool>> Handle(MarkConversationAsReadCommand request, CancellationToken cancellationToken)
        {
            var member = (await _memberRepository.ListAllAsync(cancellationToken))
                .FirstOrDefault(m => m.ConversationId == request.ConversationId && m.UserId == request.UserId);

            if (member == null)
            {
                return Result<bool>.Failure(new[] { "Member not found in conversation" });
            }

            member.LastReadAt = DateTime.UtcNow;
            await _memberRepository.UpdateAsync(member, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _chatNotificationService.NotifyMessageRead(request.ConversationId, Guid.Empty, request.UserId);

            return Result<bool>.Success(true);
        }
    }
}
