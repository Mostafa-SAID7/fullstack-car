using Application.Common.Models;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class RemoveGroupMemberCommand : IRequest<Result<bool>>
    {
        public Guid GroupId { get; set; }
        public Guid MemberId { get; set; }
        public Guid RemovedBy { get; set; }
        public string? Reason { get; set; }
    }

    public class RemoveGroupMemberCommandHandler : IRequestHandler<RemoveGroupMemberCommand, Result<bool>>
    {
        private readonly IRepository<GroupMember> _memberRepository;
        private readonly IRepository<Group> _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RemoveGroupMemberCommandHandler(
            IRepository<GroupMember> memberRepository,
            IRepository<Group> groupRepository,
            IUnitOfWork unitOfWork)
        {
            _memberRepository = memberRepository;
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(RemoveGroupMemberCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var member = await _memberRepository.GetByIdAsync(request.MemberId, cancellationToken);
                if (member == null)
                {
                    return Result<bool>.Failure("Member not found");
                }

                var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
                if (group == null)
                {
                    return Result<bool>.Failure("Group not found");
                }

                await _memberRepository.DeleteAsync(member, cancellationToken);
                
                // Update group member count
                group.MemberCount = Math.Max(0, group.MemberCount - 1);
                await _groupRepository.UpdateAsync(group, cancellationToken);
                
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to remove member: {ex.Message}");
            }
        }
    }
}