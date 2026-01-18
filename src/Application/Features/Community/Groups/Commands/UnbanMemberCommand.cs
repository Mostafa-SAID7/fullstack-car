using Application.Common.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class UnbanMemberCommand : IRequest<Result<bool>>
    {
        public Guid GroupId { get; set; }
        public Guid MemberId { get; set; }
        public Guid UnbannedBy { get; set; }
    }

    public class UnbanMemberCommandHandler : IRequestHandler<UnbanMemberCommand, Result<bool>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupBanRepository _banRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public UnbanMemberCommandHandler(
            IGroupRepository groupRepository,
            IGroupBanRepository banRepository,
            INotificationService notificationService,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _banRepository = banRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(UnbanMemberCommand request, CancellationToken cancellationToken)
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
                var canUnban = await _groupRepository.IsUserOwnerAsync(request.GroupId, request.UnbannedBy, cancellationToken) ||
                             await _groupRepository.IsUserModeratorAsync(request.GroupId, request.UnbannedBy, cancellationToken);

                if (!canUnban)
                {
                    return Result<bool>.Failure("You don't have permission to unban members");
                }

                // Get active ban
                var ban = await _banRepository.GetActiveByGroupAndUserAsync(request.GroupId, request.MemberId, cancellationToken);
                if (ban == null)
                {
                    return Result<bool>.Failure("No active ban found for this user");
                }

                // Lift the ban
                await _banRepository.LiftBanAsync(ban.Id, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Send notification
                await _notificationService.NotifyGroupMemberUnbannedAsync(
                    request.GroupId,
                    request.MemberId,
                    "Unknown User"); // TODO: Get username

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to unban member: {ex.Message}");
            }
        }
    }
}