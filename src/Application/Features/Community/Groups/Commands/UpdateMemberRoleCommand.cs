using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class UpdateMemberRoleCommand : IRequest<Result<GroupMemberDto>>
    {
        public Guid GroupId { get; set; }
        public Guid MemberId { get; set; }
        public Guid UpdatedBy { get; set; }
        public UpdateMemberRoleRequest Request { get; set; } = new();
    }

    public class UpdateMemberRoleCommandHandler : IRequestHandler<UpdateMemberRoleCommand, Result<GroupMemberDto>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupMemberRepository _memberRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateMemberRoleCommandHandler(
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

        public async Task<Result<GroupMemberDto>> Handle(UpdateMemberRoleCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate group exists
                var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
                if (group == null)
                {
                    return Result<GroupMemberDto>.Failure("Group not found");
                }

                // Check permissions
                var canManage = await _groupRepository.IsUserOwnerAsync(request.GroupId, request.UpdatedBy, cancellationToken) ||
                              await _groupRepository.IsUserModeratorAsync(request.GroupId, request.UpdatedBy, cancellationToken);

                if (!canManage)
                {
                    return Result<GroupMemberDto>.Failure("You don't have permission to update member roles");
                }

                // Get member
                var member = await _memberRepository.GetByGroupAndUserAsync(request.GroupId, request.MemberId, cancellationToken);
                if (member == null)
                {
                    return Result<GroupMemberDto>.Failure("Member not found in this group");
                }

                // Check if trying to change owner role
                var isOwner = await _groupRepository.IsUserOwnerAsync(request.GroupId, request.MemberId, cancellationToken);
                if (isOwner)
                {
                    return Result<GroupMemberDto>.Failure("Cannot change the role of the group owner");
                }

                // Validate new role
                var validRoles = new[] { "Member", "Moderator", "Admin" };
                if (!validRoles.Contains(request.Request.NewRole))
                {
                    return Result<GroupMemberDto>.Failure("Invalid role specified");
                }

                var oldRole = member.Role;

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
                return Result<GroupMemberDto>.Failure($"Failed to update member role: {ex.Message}");
            }
        }
    }
}