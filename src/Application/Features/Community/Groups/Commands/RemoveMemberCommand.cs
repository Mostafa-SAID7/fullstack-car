using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class RemoveMemberCommand : IRequest<Result<bool>>
    {
        public Guid GroupId { get; set; }
        public Guid MemberId { get; set; }
        public Guid RemovedBy { get; set; }
        public RemoveMemberRequest Request { get; set; } = new();
    }

    public class RemoveMemberCommandHandler : IRequestHandler<RemoveMemberCommand, Result<bool>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupMemberRepository _memberRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public RemoveMemberCommandHandler(
            IGroupRepository groupRepository,
            IGroupMemberRepository memberRepository,
            INotificationService notificationService,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _memberRepository = memberRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(RemoveMemberCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate group exists
                var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
                if (group == null)
                {
                    return Result<bool>.Failure("Group not found");
                }

                // Check permissions
                var canRemove = await _groupRepository.IsUserOwnerAsync(request.GroupId, request.RemovedBy, cancellationToken) ||
                              await _groupRepository.IsUserModeratorAsync(request.GroupId, request.RemovedBy, cancellationToken);

                if (!canRemove)
                {
                    return Result<bool>.Failure("You don't have permission to remove members");
                }

                // Check if trying to remove owner
                var isOwner = await _groupRepository.IsUserOwnerAsync(request.GroupId, request.MemberId, cancellationToken);
                if (isOwner)
                {
                    return Result<bool>.Failure("Cannot remove the group owner");
                }

                // Get member
                var member = await _memberRepository.GetByGroupAndUserAsync(request.GroupId, request.MemberId, cancellationToken);
                if (member == null)
                {
                    return Result<bool>.Failure("Member not found in this group");
                }

                // Remove member
                await _memberRepository.RemoveMemberAsync(request.GroupId, request.MemberId, cancellationToken);

                // Update group member count
                group.MemberCount = Math.Max(0, group.MemberCount - 1);
                await _groupRepository.UpdateAsync(group, cancellationToken);

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Send notification if requested
                if (request.Request.NotifyMember)
                {
                    await _notificationService.NotifyGroupMemberLeftAsync(
                        request.GroupId,
                        request.MemberId,
                        member.User?.UserName ?? "Unknown User");
                }

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to remove member: {ex.Message}");
            }
        }
    }
}