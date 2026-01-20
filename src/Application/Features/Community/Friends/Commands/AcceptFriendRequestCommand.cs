using Application.Common.Models;
using Domain.Entities.Profile;
using Domain.Entities.Identity;
using Domain.Enums.Community.Social;
using Domain.Interfaces;
using Application.Features.Shared.Caching.Interfaces.Services;
using Application.Features.Shared.Notifications.Interfaces;
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
        private readonly IRepository<ApplicationUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private readonly INotificationService _notificationService;

        public AcceptFriendRequestCommandHandler(
            IRepository<UserFriend> friendRepository,
            IRepository<ApplicationUser> userRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService,
            INotificationService notificationService)
        {
            _friendRepository = friendRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
            _notificationService = notificationService;
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

            // Send notification to the requester
            var acceptor = await _userRepository.GetByIdAsync(command.UserId, cancellationToken);
            var acceptorName = acceptor != null ? $"{acceptor.FirstName} {acceptor.LastName}" : "Someone";
            await _notificationService.SendNotificationAsync(
                request.UserId.ToString(),
                "Friend Request Accepted",
                $"{acceptorName} accepted your friend request.",
                $"/users/{command.UserId}",
                command.UserId,
                cancellationToken);

            // Invalidate caches for both users
            await _cacheService.RemoveByTagAsync($"Friends_{request.UserId}", cancellationToken);
            await _cacheService.RemoveByTagAsync($"Friends_{request.FriendId}", cancellationToken);
            await _cacheService.RemoveByTagAsync($"Requests_{request.FriendId}", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
