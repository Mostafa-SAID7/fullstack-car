using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Community.Groups;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class BanMemberCommand : IRequest<Result<BannedMemberDto>>
    {
        public Guid GroupId { get; set; }
        public Guid MemberId { get; set; }
        public Guid BannedBy { get; set; }
        public BanMemberRequest Request { get; set; } = new();
    }

    public class BanMemberCommandHandler : IRequestHandler<BanMemberCommand, Result<BannedMemberDto>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupMemberRepository _memberRepository;
        private readonly IGroupBanRepository _banRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public BanMemberCommandHandler(
            IGroupRepository groupRepository,
            IGroupMemberRepository memberRepository,
            IGroupBanRepository banRepository,
            INotificationService notificationService,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _memberRepository = memberRepository;
            _banRepository = banRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<BannedMemberDto>> Handle(BanMemberCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate group exists
                var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
                if (group == null)
                {
                    return Result<BannedMemberDto>.Failure("Group not found");
                }

                // Check permissions
                var canBan = await _groupRepository.IsUserOwnerAsync(request.GroupId, request.BannedBy, cancellationToken) ||
                           await _groupRepository.IsUserModeratorAsync(request.GroupId, request.BannedBy, cancellationToken);

                if (!canBan)
                {
                    return Result<BannedMemberDto>.Failure("You don't have permission to ban members");
                }

                // Check if trying to ban owner
                var isOwner = await _groupRepository.IsUserOwnerAsync(request.GroupId, request.MemberId, cancellationToken);
                if (isOwner)
                {
                    return Result<BannedMemberDto>.Failure("Cannot ban the group owner");
                }

                // Get member
                var member = await _memberRepository.GetByGroupAndUserAsync(request.GroupId, request.MemberId, cancellationToken);
                if (member == null)
                {
                    return Result<BannedMemberDto>.Failure("Member not found in this group");
                }

                // Check if already banned
                var existingBan = await _banRepository.GetActiveByGroupAndUserAsync(request.GroupId, request.MemberId, cancellationToken);
                if (existingBan != null)
                {
                    return Result<BannedMemberDto>.Failure("Member is already banned");
                }

                // Create ban record
                var ban = new GroupBan
                {
                    Id = Guid.NewGuid(),
                    GroupId = request.GroupId,
                    UserId = request.MemberId,
                    Reason = request.Request.Reason,
                    BannedBy = request.BannedBy,
                    BannedAt = DateTime.UtcNow,
                    BanUntil = request.Request.BanUntil,
                    IsActive = true
                };

                await _banRepository.AddAsync(ban, cancellationToken);

                // Remove member from group
                await _memberRepository.RemoveMemberAsync(request.GroupId, request.MemberId, cancellationToken);

                // Update group member count
                group.MemberCount = Math.Max(0, group.MemberCount - 1);
                await _groupRepository.UpdateAsync(group, cancellationToken);

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Send notification
                await _notificationService.NotifyGroupMemberBannedAsync(
                    request.GroupId,
                    request.MemberId,
                    member.User?.UserName ?? "Unknown User",
                    request.Request.Reason);

                // Map to DTO
                var bannedMemberDto = new BannedMemberDto
                {
                    Id = ban.Id,
                    Member = new GroupMemberDto
                    {
                        Id = member.Id,
                        UserId = member.UserId,
                        Username = member.User?.UserName ?? "Unknown",
                        DisplayName = member.User?.UserName ?? "Unknown",
                        Role = member.Role,
                        JoinedAt = member.JoinedAt
                    },
                    Reason = ban.Reason,
                    BannedAt = ban.BannedAt,
                    BanUntil = ban.BanUntil,
                    IsActive = ban.IsActive
                };

                return Result<BannedMemberDto>.Success(bannedMemberDto);
            }
            catch (Exception ex)
            {
                return Result<BannedMemberDto>.Failure($"Failed to ban member: {ex.Message}");
            }
        }
    }
}