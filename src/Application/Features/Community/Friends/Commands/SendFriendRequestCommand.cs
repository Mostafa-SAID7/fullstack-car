using Application.Common.Models;
using Domain.Entities.Community.Social;
using Domain.Entities.Identity;
using Domain.Enums.Community.Social;
using Domain.Interfaces;
using Application.Common.Specifications.Community.Social;
using Application.Features.Shared.Interfaces.Caching;
using Application.Features.Shared.Notifications.Interfaces;
using MediatR;

namespace Application.Features.Community.Friends.Commands
{
    public class SendFriendRequestCommand : IRequest<Result<bool>>
    {
        public Guid UserId { get; set; }
        public Guid FriendId { get; set; }
    }

    public class SendFriendRequestCommandHandler : IRequestHandler<SendFriendRequestCommand, Result<bool>>
    {
        private readonly IRepository<UserFriend> _friendRepository;
        private readonly IRepository<ApplicationUser> _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        private readonly INotificationService _notificationService;

        public SendFriendRequestCommandHandler(
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

        public async Task<Result<bool>> Handle(SendFriendRequestCommand command, CancellationToken cancellationToken)
        {
            if (command.UserId == command.FriendId)
            {
                return Result<bool>.Failure(new[] { "You cannot send a friend request to yourself" });
            }

            var friend = await _userRepository.GetByIdAsync(command.FriendId, cancellationToken);
            if (friend == null)
            {
                return Result<bool>.Failure(new[] { "Target user not found" });
            }

            var specification = new FriendshipExistenceSpecification(command.UserId, command.FriendId);
            var existing = await _friendRepository.FirstOrDefaultAsync(specification, cancellationToken);

            if (existing != null)
            {
                if (existing.Status == FriendshipStatus.Accepted)
                    return Result<bool>.Failure(new[] { "You are already friends" });

                if (existing.Status == FriendshipStatus.Pending)
                    return Result<bool>.Failure(new[] { "A friend request is already pending" });

                if (existing.Status == FriendshipStatus.Blocked)
                    return Result<bool>.Failure(new[] { "Unable to send request" });
            }

            var friendship = new UserFriend
            {
                UserId = command.UserId,
                FriendId = command.FriendId,
                Status = FriendshipStatus.Pending
            };

            await _friendRepository.AddAsync(friendship, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Send notification
            var sender = await _userRepository.GetByIdAsync(command.UserId, cancellationToken);
            var senderName = sender != null ? $"{sender.FirstName} {sender.LastName}" : "Someone";
            await _notificationService.SendNotificationAsync(
                command.FriendId.ToString(),
                "New Friend Request",
                $"{senderName} sent you a friend request.",
                "/friends/requests",
                command.UserId,
                cancellationToken);

            await _cacheService.RemoveByTagAsync($"Requests_{command.FriendId}", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
