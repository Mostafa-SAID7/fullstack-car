using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Domain.Policies;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class UpdateGroupCommand : IRequest<Result<GroupDto>>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public UpdateGroupRequest Request { get; set; } = null!;
    }

    public class UpdateGroupCommandHandler : IRequestHandler<UpdateGroupCommand, Result<GroupDto>>
    {
        private readonly IRepository<Group> _groupRepository;
        private readonly IRepository<ApplicationUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public UpdateGroupCommandHandler(
            IRepository<Group> groupRepository,
            IRepository<ApplicationUser> userRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService)
        {
            _groupRepository = groupRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<GroupDto>> Handle(UpdateGroupCommand command, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdAsync(command.Id, cancellationToken);
            if (group == null)
            {
                return Result<GroupDto>.Failure(new[] { "Group not found" });
            }

            var user = await _userRepository.GetByIdAsync(command.UserId, cancellationToken);
            if (user == null)
            {
                return Result<GroupDto>.Failure(new[] { "User not found" });
            }

            if (!GroupPolicy.CanEdit(group, user))
            {
                return Result<GroupDto>.Failure(new[] { "You are not authorized to edit this group" });
            }

            group.Name = command.Request.Name;
            group.Description = command.Request.Description;
            group.ImageUrl = command.Request.ImageUrl;
            group.Privacy = command.Request.Privacy;

            await _groupRepository.UpdateAsync(group, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _cacheService.RemoveAsync($"Group_{group.Id}", cancellationToken);
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
                UpdatedAt = group.UpdatedAt,
                OwnerId = group.OwnerId
            };

            return Result<GroupDto>.Success(groupDto);
        }
    }
}
