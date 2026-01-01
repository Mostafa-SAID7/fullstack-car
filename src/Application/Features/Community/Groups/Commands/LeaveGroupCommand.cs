using Application.Common.Models;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class LeaveGroupCommand : IRequest<Result<bool>>
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
    }

    public class LeaveGroupCommandHandler : IRequestHandler<LeaveGroupCommand, Result<bool>>
    {
        private readonly IRepository<Group> _groupRepository;
        private readonly IRepository<GroupMember> _memberRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public LeaveGroupCommandHandler(
            IRepository<Group> groupRepository,
            IRepository<GroupMember> memberRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService)
        {
            _groupRepository = groupRepository;
            _memberRepository = memberRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<bool>> Handle(LeaveGroupCommand command, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdAsync(command.GroupId, cancellationToken);
            if (group == null)
            {
                return Result<bool>.Failure(new[] { "Group not found" });
            }

            var existingMember = (await _memberRepository.GetAllAsync(cancellationToken))
                .FirstOrDefault(m => m.GroupId == command.GroupId && m.UserId == command.UserId);

            if (existingMember == null)
            {
                return Result<bool>.Failure(new[] { "You are not a member of this group" });
            }

            if (group.OwnerId == command.UserId)
            {
                return Result<bool>.Failure(new[] { "Owner cannot leave the group. Transfer ownership or delete the group." });
            }

            await _memberRepository.DeleteAsync(existingMember, cancellationToken);
            group.MembersCount = Math.Max(0, group.MembersCount - 1);
            await _groupRepository.UpdateAsync(group, cancellationToken);
            
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _cacheService.RemoveAsync($"Group_{group.Id}", cancellationToken);
            await _cacheService.RemoveByTagAsync("Groups", cancellationToken);
            await _cacheService.RemoveByTagAsync($"GroupMembers_{group.Id}", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
