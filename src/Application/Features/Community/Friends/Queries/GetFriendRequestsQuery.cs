using Application.Common.Models;
using Application.Features.Community.Friends.DTOs;
using Domain.Entities.Profile;
using Domain.Interfaces;
using Application.Common.Specifications.Profile;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Friends.Queries
{
    public class GetFriendRequestsQuery : IRequest<Result<PaginatedList<FriendRequestDto>>>, ICacheableRequest
    {
        public Guid UserId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Status { get; set; } = "Pending";

        public string CacheKey => $"FriendRequests_{UserId}_{PageNumber}_{PageSize}_{Status}";
        public TimeSpan? CacheExpiration => TimeSpan.FromMinutes(5);
        public string[]? CacheTags => new[] { $"Requests_{UserId}" };
    }

    public class GetFriendRequestsQueryHandler : IRequestHandler<GetFriendRequestsQuery, Result<PaginatedList<FriendRequestDto>>>
    {
        private readonly IRepository<UserFriend> _friendRepository;

        public GetFriendRequestsQueryHandler(IRepository<UserFriend> friendRepository)
        {
            _friendRepository = friendRepository;
        }

        public async Task<Result<PaginatedList<FriendRequestDto>>> Handle(GetFriendRequestsQuery request, CancellationToken cancellationToken)
        {
            var skip = (request.PageNumber - 1) * request.PageSize;
            var specification = new FriendRequestsSpecification(request.UserId, skip, request.PageSize);

            var requests = await _friendRepository.ListAsync(specification.Criteria!, cancellationToken);
            var totalCount = await _friendRepository.CountAsync(specification.Criteria!, cancellationToken);

            var requestDtos = requests.Select(r => new FriendRequestDto
            {
                id = r.Id,
                RequesterId = r.UserId,
                RequesterFirstName = r.User.FirstName,
                RequesterLastName = r.User.LastName,
                RequesterProfileImageUrl = r.User.ProfileImageUrl,
                RequestedAt = r.CreatedAt
            }).ToList();

            var paginatedList = new PaginatedList<FriendRequestDto>(requestDtos, totalCount, request.PageNumber, request.PageSize);
            return Result<PaginatedList<FriendRequestDto>>.Success(paginatedList);
        }
    }
}
