using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Community.Groups;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class InviteMemberCommand : IRequest<Result<GroupInvitationDto>>
    {
        public Guid GroupId { get; set; }
        public Guid InvitedBy { get; set; }
        public InviteMemberRequest Request { get; set; } = new();
    }

    public class InviteMemberCommandHandler : IRequestHandler<InviteMemberCommand, Result<GroupInvitationDto>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupInvitationRepository _invitationRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public InviteMemberCommandHandler(
            IGroupRepository groupRepository,
            IGroupInvitationRepository invitationRepository,
            INotificationService notificationService,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _invitationRepository = invitationRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<GroupInvitationDto>> Handle(InviteMemberCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate group exists
                var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
                if (group == null)
                {
                    return Result<GroupInvitationDto>.Failure("Group not found");
                }

                // Check permissions
                var canInvite = await _groupRepository.IsUserOwnerAsync(request.GroupId, request.InvitedBy, cancellationToken) ||
                              await _groupRepository.IsUserModeratorAsync(request.GroupId, request.InvitedBy, cancellationToken);

                if (!canInvite)
                {
                    return Result<GroupInvitationDto>.Failure("You don't have permission to invite members to this group");
                }

                // Check if already invited
                var existingInvitation = await _invitationRepository.GetByGroupAndEmailAsync(request.GroupId, request.Request.Email, cancellationToken);
                if (existingInvitation != null && existingInvitation.Status == "Pending")
                {
                    return Result<GroupInvitationDto>.Failure("User has already been invited to this group");
                }

                // Create invitation
                var invitation = new GroupInvitation
                {
                    Id = Guid.NewGuid(),
                    GroupId = request.GroupId,
                    Email = request.Request.Email,
                    Role = request.Request.Role,
                    Message = request.Request.Message,
                    Status = "Pending",
                    InvitedBy = request.InvitedBy,
                    InvitedAt = DateTime.UtcNow,
                    ExpiresAt = request.Request.ExpiresAt ?? DateTime.UtcNow.AddDays(7)
                };

                await _invitationRepository.AddAsync(invitation, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Send notification
                await _notificationService.NotifyGroupInvitationAsync(
                    request.GroupId,
                    request.Request.Email,
                    group.Name,
                    "Inviter"); // TODO: Get inviter name

                // Map to DTO
                var invitationDto = new GroupInvitationDto
                {
                    Id = invitation.Id,
                    GroupId = invitation.GroupId,
                    GroupName = group.Name,
                    Email = invitation.Email,
                    Role = invitation.Role,
                    Message = invitation.Message,
                    Status = invitation.Status,
                    InvitedAt = invitation.InvitedAt,
                    ExpiresAt = invitation.ExpiresAt
                };

                return Result<GroupInvitationDto>.Success(invitationDto);
            }
            catch (Exception ex)
            {
                return Result<GroupInvitationDto>.Failure($"Failed to invite member: {ex.Message}");
            }
        }
    }
}