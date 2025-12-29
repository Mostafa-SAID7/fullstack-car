using Application.Common.Models;
using Domain.Entities.Community.Social;
using Domain.Enums.Community.Social;
using Domain.Interfaces;
using Application.Common.Interfaces.Caching;
using MediatR;

namespace Application.Features.Community.Friends.Commands
{
    public class AcceptFriendRequestCommand : IRequest<Result<bool>>
    {
        public Guid RequestId { get; set; }
        public Guid UserId { get; set; }
    }

    public class AcceptFriendRequestCommandHandler : IRequestHandler<AcceptFriendRequestCommand, Result<bool>>
    {
        private readonly IRepository<UserFriend> _friendRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public AcceptFriendRequestCommandHandler(
            IRepository<UserFriend> friendRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService)
        {
            _friendRepository = friendRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<bool>> Handle(AcceptFriendRequestCommand command, CancellationToken cancellationToken)
        {
            var request = await _friendRepository.GetByIdAsync(command.RequestId, cancellationToken);

            if (request == null || request.FriendId != command.UserId)
            {
                return Result<bool>.Failure(new[] { "Friend request not found" });
            }

            if (request.Status != FriendshipStatus.Pending)
            {
                return Result<bool>.Failure(new[] { "Request is no longer pending" });
            }

            request.Status = FriendshipStatus.Accepted;
            request.AcceptedAt = DateTime.UtcNow;

            await _friendRepository.UpdateAsync(request, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Invalidate caches for both users
            await _cacheService.RemoveByTagAsync($"Friends_{request.UserId}", cancellationToken);
            await _cacheService.RemoveByTagAsync($"Friends_{request.FriendId}", cancellationToken);
            await _cacheService.RemoveByTagAsync($"Requests_{request.FriendId}", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
