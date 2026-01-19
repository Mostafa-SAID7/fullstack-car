using Application.Common.Models;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class ArchiveGroupCommand : IRequest<Result<bool>>
    {
        public Guid GroupId { get; set; }
        public Guid UserId { get; set; }
        public string? Reason { get; set; }
    }

    public class ArchiveGroupCommandHandler : IRequestHandler<ArchiveGroupCommand, Result<bool>>
    {
        private readonly IRepository<Group> _groupRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ArchiveGroupCommandHandler(
            IRepository<Group> groupRepository,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(ArchiveGroupCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
                if (group == null)
                {
                    return Result<bool>.Failure("Group not found");
                }

                group.IsActive = false;
                await _groupRepository.UpdateAsync(group, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to archive group: {ex.Message}");
            }
        }
    }
}
