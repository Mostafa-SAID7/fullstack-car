using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using Application.Common.Specifications.Community.Groups;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetGroupsQuery : IRequest<Result<PaginatedList<GroupDto>>>, ICacheableRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public string CacheKey => $"GetGroups_{PageNumber}_{PageSize}";
        public TimeSpan? CacheExpiration => TimeSpan.FromMinutes(10);
        public string[]? CacheTags => new[] { "Groups" };
    }

    public class GetGroupsQueryHandler : IRequestHandler<GetGroupsQuery, Result<PaginatedList<GroupDto>>>
    {
        private readonly IRepository<Group> _groupRepository;

        public GetGroupsQueryHandler(IRepository<Group> groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<PaginatedList<GroupDto>>> Handle(GetGroupsQuery request, CancellationToken cancellationToken)
        {
            var skip = (request.PageNumber - 1) * request.PageSize;
            var specification = new AllGroupsSpecification(skip, request.PageSize);
            
            var groups = await _groupRepository.ListAsync(specification, cancellationToken);
            var totalCount = await _groupRepository.CountAsync(specification, cancellationToken);

            var groupDtos = groups.Select(g => new GroupDto
            {
                Id = g.Id,
                Name = g.Name,
                Description = g.Description,
                ImageUrl = g.ImageUrl,
                Type = g.Type,
                Privacy = g.Privacy,
                MembersCount = g.MembersCount,
                PostsCount = g.PostsCount,
                CreatedAt = g.CreatedAt,
                UpdatedAt = g.UpdatedAt,
                OwnerId = g.OwnerId,
                OwnerFirstName = g.Owner.FirstName,
                OwnerLastName = g.Owner.LastName,
                OwnerProfileImageUrl = g.Owner.ProfileImageUrl
            }).ToList();

            var paginatedList = new PaginatedList<GroupDto>(groupDtos, totalCount, request.PageNumber, request.PageSize);
            return Result<PaginatedList<GroupDto>>.Success(paginatedList);
        }
    }
}
