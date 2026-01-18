using Application.Common.Models;
using Application.Common.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class LeaveGroupCommand : IRequest<Result<bool>>
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public string? LeaveReason { get; set; }
    }

    public class LeaveGroupCommandHandler : IRequestHandler<LeaveGroupCommand, Result<bool>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupMemberRepository _memberRepository;
        private readonly IUnitOfWork _unitOfWork;

        public LeaveGroupCommandHandler(
            IGroupRepository groupRepository,
            IGroupMemberRepository memberRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _memberRepository = memberRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(LeaveGroupCommand request, CancellationToken cancellationToken)
        {
            // Check if group exists
            var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
            if (group == null)
            {
                return Result<bool>.Failure(new[] { "Group not found" });
            }

            // Check if user is a member
            var member = await _memberRepository.GetByGroupAndUserAsync(request.GroupId, request.UserId, cancellationToken);
            if (member == null)
            {
                return Result<bool>.Failure(new[] { "User is not a member of this group" });
            }

            // Check if user is the owner
            if (group.OwnerId == request.UserId)
            {
                return Result<bool>.Failure(new[] { "Group owner cannot leave the group. Transfer ownership first" });
            }

            // Remove member
            await _memberRepository.RemoveMemberAsync(request.GroupId, request.UserId, cancellationToken);

            // Update group member count
            group.MemberCount = Math.Max(0, group.MemberCount - 1);
            group.LastActivity = DateTime.UtcNow;
            await _groupRepository.UpdateAsync(group, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}