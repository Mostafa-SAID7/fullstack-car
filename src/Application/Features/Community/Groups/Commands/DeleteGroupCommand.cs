using Application.Common.Models;
using Domain.Entities.Community.Groups;
using Domain.Entities.Identity;
using Domain.Interfaces;
using Domain.Policies;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class DeleteGroupCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
    }

    public class DeleteGroupCommandHandler : IRequestHandler<DeleteGroupCommand, Result<bool>>
    {
        private readonly IRepository<Group> _groupRepository;
        private readonly IRepository<ApplicationUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public DeleteGroupCommandHandler(
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

        public async Task<Result<bool>> Handle(DeleteGroupCommand command, CancellationToken cancellationToken)
        {
            var group = await _groupRepository.GetByIdAsync(command.Id, cancellationToken);
            if (group == null)
            {
                return Result<bool>.Failure(new[] { "Group not found" });
            }

            var user = await _userRepository.GetByIdAsync(command.UserId, cancellationToken);
            if (user == null)
            {
                return Result<bool>.Failure(new[] { "User not found" });
            }

            if (!GroupPolicy.CanDelete(group, user))
            {
                return Result<bool>.Failure(new[] { "You are not authorized to delete this group" });
            }

            await _groupRepository.DeleteAsync(group, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _cacheService.RemoveAsync($"Group_{group.Id}", cancellationToken);
            await _cacheService.RemoveByTagAsync("Groups", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
