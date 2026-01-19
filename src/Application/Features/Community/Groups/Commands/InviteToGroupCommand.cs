using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class InviteToGroupCommand : IRequest<Result<List<GroupInvitationDto>>>
    {
        public Guid GroupId { get; set; }
        public Guid InvitedBy { get; set; }
        public InviteToGroupRequest Request { get; set; } = new();
    }

    public class InviteToGroupCommandHandler : IRequestHandler<InviteToGroupCommand, Result<List<GroupInvitationDto>>>
    {
        private readonly IRepository<GroupInvitation> _invitationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public InviteToGroupCommandHandler(
            IRepository<GroupInvitation> invitationRepository,
            IUnitOfWork unitOfWork)
        {
            _invitationRepository = invitationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<List<GroupInvitationDto>>> Handle(InviteToGroupCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var invitations = new List<GroupInvitationDto>();

                foreach (var userId in request.Request.UserIds)
                {
                    var invitation = new GroupInvitation
                    {
                        GroupId = request.GroupId,
                        InvitedUserId = userId,
                        InvitedBy = request.InvitedBy,
                        Message = request.Request.Message,
                        CreatedAt = DateTime.UtcNow,
                        Status = "Pending"
                    };

                    await _invitationRepository.AddAsync(invitation, cancellationToken);

                    invitations.Add(new GroupInvitationDto
                    {
                        Id = invitation.Id,
                        GroupId = invitation.GroupId,
                        GroupName = string.Empty, // TODO: Get group name
                        Email = string.Empty, // TODO: Get user email
                        Role = "Member",
                        Message = invitation.Message,
                        Status = invitation.Status,
                        InvitedAt = invitation.CreatedAt
                    });
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result<List<GroupInvitationDto>>.Success(invitations);
            }
            catch (Exception ex)
            {
                return Result<List<GroupInvitationDto>>.Failure($"Failed to send invitations: {ex.Message}");
            }
        }
    }
}
