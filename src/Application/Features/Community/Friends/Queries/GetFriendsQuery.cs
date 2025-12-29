using Application.Common.Models;
using Application.Features.Community.Friends.DTOs;
using Domain.Entities.Community.Social;
using Domain.Interfaces;
using Domain.Specifications;
using Application.Common.Interfaces.Caching;
using MediatR;

namespace Application.Features.Community.Friends.Queries
{
    public class GetFriendsQuery : IRequest<Result<PaginatedList<FriendDto>>>, ICacheableRequest
    {
        public Guid UserId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public string CacheKey => $"Friends_{UserId}_{PageNumber}_{PageSize}";
        public TimeSpan? Expiration => TimeSpan.FromMinutes(10);
        public string? CacheTag => $"Friends_{UserId}";
    }

    public class GetFriendsQueryHandler : IRequestHandler<GetFriendsQuery, Result<PaginatedList<FriendDto>>>
    {
        private readonly IRepository<UserFriend> _friendRepository;

        public GetFriendsQueryHandler(IRepository<UserFriend> friendRepository)
        {
            _friendRepository = friendRepository;
        }

        public async Task<Result<PaginatedList<FriendDto>>> Handle(GetFriendsQuery request, CancellationToken cancellationToken)
        {
            var skip = (request.PageNumber - 1) * request.PageSize;
            var specification = new FriendsListSpecification(request.UserId, skip, request.PageSize);

            var friendships = await _friendRepository.ListAsync(specification, cancellationToken);
            var totalCount = await _friendRepository.CountAsync(specification, cancellationToken);

            var friendDtos = friendships.Select(f =>
            {
                var friend = f.UserId == request.UserId ? f.Friend : f.User;
                return new FriendDto
                {
                    Id = friend.Id,
                    FirstName = friend.FirstName,
                    LastName = friend.LastName,
                    ProfileImageUrl = friend.ProfileImageUrl,
                    FriendsSince = f.AcceptedAt ?? f.CreatedAt
                };
            }).ToList();

            var paginatedList = new PaginatedList<FriendDto>(friendDtos, totalCount, request.PageNumber, request.PageSize);
            return Result<PaginatedList<FriendDto>>.Success(paginatedList);
        }
    }
}
