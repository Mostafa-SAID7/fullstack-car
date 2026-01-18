using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Application.Common.Interfaces;
using Domain.Entities.Community.Groups;
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
        private readonly IGroupRepository _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateGroupCommandHandler(
            IGroupRepository groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<GroupDto>> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdAsync(request.Id, cancellationToken);
            if (group == null)
            {
                return Result<GroupDto>.Failure(new[] { "Group not found" });
            }

            // Check if user is owner or has permission
            if (group.OwnerId != request.UserId)
            {
                return Result<GroupDto>.Failure(new[] { "You don't have permission to update this group" });
            }

            // Update group properties
            group.Name = request.Request.Name;
            group.Description = request.Request.Description;
            group.Category = request.Request.Category;
            group.IsPublic = request.Request.IsPublic;
            group.ImageUrl = request.Request.ImageUrl;

            await _groupRepository.UpdateAsync(group, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var groupDto = new GroupDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                ImageUrl = group.ImageUrl,
                Category = group.Category,
                IsPublic = group.IsPublic,
                IsActive = group.IsActive,
                IsFeatured = group.IsFeatured,
                MemberCount = group.MemberCount,
                PostCount = group.PostCount,
                EventCount = group.EventCount,
                CreatedAt = group.CreatedAt,
                LastActivity = group.LastActivity
            };

            return Result<GroupDto>.Success(groupDto);
        }
    }
}