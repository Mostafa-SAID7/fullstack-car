using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class PromoteMemberCommand : IRequest<Result<GroupMemberDto>>
    {
        public Guid GroupId { get; set; }
        public Guid MemberId { get; set; }
        public Guid PromotedBy { get; set; }
        public PromoteMemberRequest Request { get; set; } = new();
    }

    public class PromoteMemberCommandHandler : IRequestHandler<PromoteMemberCommand, Result<GroupMemberDto>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupMemberRepository _memberRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public PromoteMemberCommandHandler(
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

        public async Task<Result<GroupMemberDto>> Handle(PromoteMemberCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate group exists
                var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
                if (group == null)
                {
                    return Result<GroupMemberDto>.Failure("Group not found");
                }

                // Check permissions - only owners can promote members
                var isOwner = await _groupRepository.IsUserOwnerAsync(request.GroupId, request.PromotedBy, cancellationToken);
                if (!isOwner)
                {
                    return Result<GroupMemberDto>.Failure("You don't have permission to promote members");
                }

                // Get member
                var member = await _memberRepository.GetByGroupAndUserAsync(request.GroupId, request.MemberId, cancellationToken);
                if (member == null)
                {
                    return Result<GroupMemberDto>.Failure("Member not found in this group");
                }

                // Validate promotion hierarchy
                var validPromotions = new Dictionary<string, string[]>
                {
                    ["Member"] = new[] { "Moderator", "Admin" },
                    ["Moderator"] = new[] { "Admin" },
                    ["Admin"] = new string[0] // Admins can't be promoted further
                };

                if (!validPromotions.ContainsKey(member.Role) || 
                    !validPromotions[member.Role].Contains(request.Request.NewRole))
                {
                    return Result<GroupMemberDto>.Failure($"Cannot promote {member.Role} to {request.Request.NewRole}");
                }

                // Update member role
                await _memberRepository.UpdateMemberRoleAsync(request.GroupId, request.MemberId, request.Request.NewRole, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Get updated member
                var updatedMember = await _memberRepository.GetByGroupAndUserAsync(request.GroupId, request.MemberId, cancellationToken);

                // Send notification
                await _notificationService.NotifyGroupMemberRoleChangedAsync(
                    request.GroupId,
                    request.MemberId,
                    updatedMember?.User?.UserName ?? "Unknown User",
                    request.Request.NewRole);

                // Map to DTO
                var memberDto = new GroupMemberDto
                {
                    Id = updatedMember!.Id,
                    UserId = updatedMember.UserId,
                    Username = updatedMember.User?.UserName ?? "Unknown",
                    DisplayName = updatedMember.User?.UserName ?? "Unknown",
                    Role = updatedMember.Role,
                    JoinedAt = updatedMember.JoinedAt,
                    LastActivity = updatedMember.LastActivity,
                    IsOnline = updatedMember.IsOnline,
                    PostCount = updatedMember.PostCount,
                    ReputationScore = updatedMember.ReputationScore
                };

                return Result<GroupMemberDto>.Success(memberDto);
            }
            catch (Exception ex)
            {
                return Result<GroupMemberDto>.Failure($"Failed to promote member: {ex.Message}");
            }
        }
    }
}