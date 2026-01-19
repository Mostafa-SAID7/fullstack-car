using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Community.Groups;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class RequestJoinGroupCommand : IRequest<Result<GroupJoinRequestDto>>
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public JoinRequestRequest Request { get; set; } = new();
    }

    public class RequestJoinGroupCommandHandler : IRequestHandler<RequestJoinGroupCommand, Result<GroupJoinRequestDto>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupMemberRepository _memberRepository;
        private readonly IGroupJoinRequestRepository _joinRequestRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public RequestJoinGroupCommandHandler(
            IGroupRepository groupRepository,
            IGroupMemberRepository memberRepository,
            IGroupJoinRequestRepository joinRequestRepository,
            INotificationService notificationService,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _memberRepository = memberRepository;
            _joinRequestRepository = joinRequestRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<GroupJoinRequestDto>> Handle(RequestJoinGroupCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate group exists
                var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
                if (group == null)
                {
                    return Result<GroupJoinRequestDto>.Failure("Group not found");
                }

                // Check if user is already a member
                var isMember = await _memberRepository.IsMemberAsync(request.GroupId, request.UserId, cancellationToken);
                if (isMember)
                {
                    return Result<GroupJoinRequestDto>.Failure("You are already a member of this group");
                }

                // Check if user is banned
                var isBanned = await _groupRepository.IsUserBannedAsync(request.GroupId, request.UserId, cancellationToken);
                if (isBanned)
                {
                    return Result<GroupJoinRequestDto>.Failure("You are banned from this group");
                }

                // Check if user already has a pending request
                var existingRequest = await _joinRequestRepository.GetPendingByGroupAndUserAsync(request.GroupId, request.UserId, cancellationToken);
                if (existingRequest != null)
                {
                    return Result<GroupJoinRequestDto>.Failure("You have already requested to join this group");
                }

                // Create join request
                var joinRequest = new GroupJoinRequest
                {
                    Id = Guid.NewGuid(),
                    GroupId = request.GroupId,
                    UserId = request.UserId,
                    Message = request.Request.Message,
                    AdditionalInfo = request.Request.AdditionalInfo,
                    Status = "Pending",
                    RequestedAt = DateTime.UtcNow
                };

                await _joinRequestRepository.AddAsync(joinRequest, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Send notification to group moderators/owner
                await _notificationService.NotifyGroupJoinRequestAsync(
                    request.GroupId,
                    request.UserId,
                    "Requester Name"); // TODO: Get requester name

                // Map to DTO
                var joinRequestDto = new GroupJoinRequestDto
                {
                    Id = joinRequest.Id,
                    GroupId = joinRequest.GroupId,
                    GroupName = group.Name,
                    User = new GroupMemberDto
                    {
                        UserId = request.UserId,
                        Username = "Unknown", // TODO: Get username
                        DisplayName = "Unknown"
                    },
                    Message = joinRequest.Message,
                    AdditionalInfo = joinRequest.AdditionalInfo,
                    Status = joinRequest.Status,
                    RequestedAt = joinRequest.RequestedAt
                };

                return Result<GroupJoinRequestDto>.Success(joinRequestDto);
            }
            catch (Exception ex)
            {
                return Result<GroupJoinRequestDto>.Failure($"Failed to submit join request: {ex.Message}");
            }
        }
    }
}
