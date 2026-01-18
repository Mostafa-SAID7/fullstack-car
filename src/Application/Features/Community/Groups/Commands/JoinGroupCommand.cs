using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Application.Common.Interfaces;
using Domain.Entities.Community.Groups;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class JoinGroupCommand : IRequest<Result<GroupMemberDto>>
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public string? JoinMessage { get; set; }
    }

    public class JoinGroupCommandHandler : IRequestHandler<JoinGroupCommand, Result<GroupMemberDto>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupMemberRepository _memberRepository;
        private readonly IUnitOfWork _unitOfWork;

        public JoinGroupCommandHandler(
            IGroupRepository groupRepository,
            IGroupMemberRepository memberRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _memberRepository = memberRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<GroupMemberDto>> Handle(JoinGroupCommand request, CancellationToken cancellationToken)
        {
            // Check if group exists
            var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
            if (group == null)
            {
                return Result<GroupMemberDto>.Failure(new[] { "Group not found" });
            }

            // Check if user is already a member
            var existingMember = await _memberRepository.GetByGroupAndUserAsync(request.GroupId, request.UserId, cancellationToken);
            if (existingMember != null)
            {
                return Result<GroupMemberDto>.Failure(new[] { "User is already a member of this group" });
            }

            // Check if user is banned
            var isBanned = await _groupRepository.IsUserBannedAsync(request.GroupId, request.UserId, cancellationToken);
            if (isBanned)
            {
                return Result<GroupMemberDto>.Failure(new[] { "User is banned from this group" });
            }

            // Check if group is private
            if (!group.IsPublic)
            {
                return Result<GroupMemberDto>.Failure(new[] { "This is a private group. You need an invitation to join" });
            }

            // Create new member
            var member = new GroupMember
            {
                GroupId = request.GroupId,
                UserId = request.UserId,
                Role = "Member",
                JoinedAt = DateTime.UtcNow,
                LastActivity = DateTime.UtcNow
            };

            await _memberRepository.AddMemberAsync(member, cancellationToken);

            // Update group member count
            group.MemberCount++;
            group.LastActivity = DateTime.UtcNow;
            await _groupRepository.UpdateAsync(group, cancellationToken);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var memberDto = new GroupMemberDto
            {
                Id = member.Id,
                UserId = member.UserId,
                Role = member.Role,
                JoinedAt = member.JoinedAt,
                LastActivity = member.LastActivity,
                IsOnline = member.IsOnline,
                PostCount = member.PostCount,
                ReputationScore = member.ReputationScore
            };

            return Result<GroupMemberDto>.Success(memberDto);
        }
    }
}