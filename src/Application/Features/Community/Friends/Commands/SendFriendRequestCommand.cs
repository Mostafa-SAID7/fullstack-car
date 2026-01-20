using Application.Common.DTOs;
using Application.Common.Models;
using Domain.Entities.Profile;
using Domain.Entities.Identity;
using Domain.Enums.Community.Social;
using Domain.Interfaces;
using Application.Common.Specifications.Profile;
using Application.Features.Shared.Caching.Interfaces.Services;
using Application.Features.Shared.Notifications.Interfaces;
using MediatR;

namespace Application.Features.Community.Friends.Commands
{
    public class SendFriendRequestCommand : IRequest<ApiResponseDto<object>>
    {
        public Guid UserId { get; set; }
        public Guid FriendId { get; set; }
    }

    public class SendFriendRequestCommandHandler : IRequestHandler<SendFriendRequestCommand, ApiResponseDto<object>>
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

        public async Task<ApiResponseDto<object>> Handle(SendFriendRequestCommand command, CancellationToken cancellationToken)
        {
            if (command.UserId == command.FriendId)
            {
                return ApiResponseDto<object>.Failure(new[] { "You cannot send a friend request to yourself" });
            }

            var friend = await _userRepository.GetByIdAsync(command.FriendId, cancellationToken);
            if (friend == null)
            {
                return ApiResponseDto<object>.Failure(new[] { "Target user not found" });
            }

            var specification = new FriendshipExistenceSpecification(command.UserId, command.FriendId);
            var existing = await _friendRepository.FirstOrDefaultAsync(specification.Criteria!, cancellationToken);

            if (existing != null)
            {
                if (existing.Status == FriendshipStatus.Accepted)
                    return ApiResponseDto<object>.Failure(new[] { "You are already friends" });

                if (existing.Status == FriendshipStatus.Pending)
                    return ApiResponseDto<object>.Failure(new[] { "A friend request is already pending" });

                if (existing.Status == FriendshipStatus.Blocked)
                    return ApiResponseDto<object>.Failure(new[] { "Unable to send request" });
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

            return ApiResponseDto<object>.Success(true);
        }
    }
}
