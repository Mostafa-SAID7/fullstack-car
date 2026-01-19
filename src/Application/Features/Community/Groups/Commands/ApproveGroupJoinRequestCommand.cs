using Application.Common.Models;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class ApproveGroupJoinRequestCommand : IRequest<Result<bool>>
    {
        public Guid RequestId { get; set; }
        public Guid ApprovedBy { get; set; }
    }

    public class ApproveGroupJoinRequestCommandHandler : IRequestHandler<ApproveGroupJoinRequestCommand, Result<bool>>
    {
        private readonly IRepository<GroupJoinRequest> _joinRequestRepository;
        private readonly IRepository<GroupMember> _memberRepository;
        private readonly IRepository<Group> _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ApproveGroupJoinRequestCommandHandler(
            IRepository<GroupJoinRequest> joinRequestRepository,
            IRepository<GroupMember> memberRepository,
            IRepository<Group> groupRepository,
            IUnitOfWork unitOfWork)
        {
            _joinRequestRepository = joinRequestRepository;
            _memberRepository = memberRepository;
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(ApproveGroupJoinRequestCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var joinRequest = await _joinRequestRepository.GetByIdAsync(request.RequestId, cancellationToken);
                if (joinRequest == null)
                {
                    return Result<bool>.Failure("Join request not found");
                }

                // Create group member
                var member = new GroupMember
                {
                    GroupId = joinRequest.GroupId,
                    UserId = joinRequest.UserId,
                    Role = "Member",
                    JoinedAt = DateTime.UtcNow
                };

                await _memberRepository.AddAsync(member, cancellationToken);

                // Update join request status
                joinRequest.Status = "Approved";
                joinRequest.ProcessedAt = DateTime.UtcNow;
                joinRequest.ProcessedBy = request.ApprovedBy;
                await _joinRequestRepository.UpdateAsync(joinRequest, cancellationToken);

                // Update group member count
                var group = await _groupRepository.GetByIdAsync(joinRequest.GroupId, cancellationToken);
                if (group != null)
                {
                    group.MemberCount++;
                    await _groupRepository.UpdateAsync(group, cancellationToken);
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken);
                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to approve join request: {ex.Message}");
            }
        }
    }
}
