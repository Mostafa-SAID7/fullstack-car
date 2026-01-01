using Application.Common.Models;
using Domain.Entities.Community.Social;
using Domain.Enums.Community.Social;
using Domain.Interfaces;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Friends.Commands
{
    public class DeclineFriendRequestCommand : IRequest<Result<bool>>
    {
        public Guid RequestId { get; set; }
        public Guid UserId { get; set; }
    }

    public class DeclineFriendRequestCommandHandler : IRequestHandler<DeclineFriendRequestCommand, Result<bool>>
    {
        private readonly IRepository<UserFriend> _friendRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;

        public DeclineFriendRequestCommandHandler(
            IRepository<UserFriend> friendRepository,
            IUnitOfWork unitOfWork,
            ICacheService cacheService)
        {
            _friendRepository = friendRepository;
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<Result<bool>> Handle(DeclineFriendRequestCommand command, CancellationToken cancellationToken)
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

            // We can either delete the record or mark it as declined. 
            // Deleting allows the user to send the request again eventually.
            await _friendRepository.DeleteAsync(request, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _cacheService.RemoveByTagAsync($"Requests_{command.UserId}", cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
