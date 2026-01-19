using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class FeatureGroupCommand : IRequest<Result<bool>>
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public Guid FeaturedBy { get; set; }
        public FeatureGroupRequest Request { get; set; } = new();
    }

    public class FeatureGroupCommandHandler : IRequestHandler<FeatureGroupCommand, Result<bool>>
    {
        private readonly IRepository<Group> _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public FeatureGroupCommandHandler(
            IRepository<Group> groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(FeatureGroupCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
                if (group == null)
                {
                    return Result<bool>.Failure("Group not found");
                }

                group.IsFeatured = true;
                await _groupRepository.UpdateAsync(group, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to feature group: {ex.Message}");
            }
        }
    }
}
