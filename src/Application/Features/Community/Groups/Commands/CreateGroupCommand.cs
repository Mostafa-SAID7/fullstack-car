using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using Application.Features.Shared.Caching.Interfaces.Services;
using Domain.Enums.Community.Groups;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class CreateGroupCommand : IRequest<Result<GroupDto>>
    {
        public Guid OwnerId { get; set; }
        public CreateGroupRequest Request { get; set; } = null!;
    }

    public class CreateGroupCommandHandler : IRequestHandler<CreateGroupCommand, Result<GroupDto>>
    {
        private readonly IRepository<Group> _groupRepository;
        private readonly IRepository<GroupMember> _memberRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public CreateGroupCommandHandler(
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

        public async Task<Result<GroupDto>> Handle(CreateGroupCommand command, CancellationToken cancellationToken)
        {
            var group = new Group
            {
                Name = command.Request.Name,
                Description = command.Request.Description,
                ImageUrl = command.Request.ImageUrl,
                Type = command.Request.Type,
                Privacy = command.Request.Privacy,
                OwnerId = command.OwnerId,
                MembersCount = 1
            };

            await _groupRepository.AddAsync(group, cancellationToken);

            var ownerMember = new GroupMember
            {
                GroupId = group.Id,
                UserId = command.OwnerId,
                Role = GroupMemberRole.Admin
            };

            await _memberRepository.AddAsync(ownerMember, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _cacheService.RemoveByTagAsync("Groups", cancellationToken);

            var groupDto = new GroupDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                ImageUrl = group.ImageUrl,
                Type = group.Type,
                Privacy = group.Privacy,
                MembersCount = group.MembersCount,
                CreatedAt = group.CreatedAt,
                OwnerId = group.OwnerId
            };

            return Result<GroupDto>.Success(groupDto);
        }
    }
}
