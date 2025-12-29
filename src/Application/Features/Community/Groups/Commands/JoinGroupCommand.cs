using Application.Common.Models;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using Application.Common.Interfaces.Caching;
using Domain.Enums.Community.Groups;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class JoinGroupCommand : IRequest<Result<bool>>
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
    }

    public class JoinGroupCommandHandler : IRequestHandler<JoinGroupCommand, Result<bool>>
    {
        private readonly IRepository<Group> _groupRepository;
        private readonly IRepository<GroupMember> _memberRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public JoinGroupCommandHandler(
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

        public async Task<Result<bool>> Handle(JoinGroupCommand command, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdAsync(command.GroupId, cancellationToken);
            if (group == null)
            {
                return Result<bool>.Failure(new[] { "Group not found" });
            }

            var existingMember = (await _memberRepository.GetAllAsync(cancellationToken))
                .FirstOrDefault(m => m.GroupId == command.GroupId && m.UserId == command.UserId);

            if (existingMember != null)
            {
                return Result<bool>.Failure(new[] { "You are already a member of this group" });
            }

            var member = new GroupMember
            {
                GroupId = command.GroupId,
                UserId = command.UserId,
                Role = GroupMemberRole.Member
            };

            await _memberRepository.AddAsync(member, cancellationToken);
            group.MembersCount++;
            await _groupRepository.UpdateAsync(group, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _cacheService.RemoveAsync($"Group_{group.Id}", cancellationToken);
            await _cacheService.RemoveByTagAsync("Groups", cancellationToken);
            await _cacheService.RemoveByTagAsync($"GroupMembers_{group.Id}", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
