using Application.Common.Models;
using Domain.Entities.Community.Social;
using Domain.Enums.Community.Social;
using Domain.Interfaces;
using Domain.Specifications;
using Application.Common.Interfaces.Caching;
using MediatR;

namespace Application.Features.Community.Friends.Commands
{
    public class RemoveFriendCommand : IRequest<Result<bool>>
    {
        public Guid UserId { get; set; }
        public Guid FriendId { get; set; }
    }

    public class RemoveFriendCommandHandler : IRequestHandler<RemoveFriendCommand, Result<bool>>
    {
        private readonly IRepository<UserFriend> _friendRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public RemoveFriendCommandHandler(
            IRepository<UserFriend> friendRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService)
        {
            _friendRepository = friendRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<bool>> Handle(RemoveFriendCommand command, CancellationToken cancellationToken)
        {
            var specification = new FriendshipExistenceSpecification(command.UserId, command.FriendId);
            var friendship = await _friendRepository.FirstOrDefaultAsync(specification, cancellationToken);

            if (friendship == null || friendship.Status != FriendshipStatus.Accepted)
            {
                return Result<bool>.Failure(new[] { "Friendship not found" });
            }

            await _friendRepository.DeleteAsync(friendship, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _cacheService.RemoveByTagAsync($"Friends_{command.UserId}", cancellationToken);
            await _cacheService.RemoveByTagAsync($"Friends_{command.FriendId}", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
