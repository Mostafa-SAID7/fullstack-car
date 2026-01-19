using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetUserOwnedGroupsQuery : IRequest<Result<GroupsPagedResponse>>
    {
        public Guid UserId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class GetUserOwnedGroupsQueryHandler : IRequestHandler<GetUserOwnedGroupsQuery, Result<GroupsPagedResponse>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetUserOwnedGroupsQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<GroupsPagedResponse>> Handle(GetUserOwnedGroupsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var ownedGroups = await _groupRepository.GetUserOwnedGroupsAsync(request.UserId, cancellationToken);

                // Apply pagination
                var totalCount = ownedGroups.Count();
                var pagedGroups = ownedGroups
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToList();

                var groupDtos = pagedGroups.Select(g => new GroupSummaryDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Description = g.Description,
                    ImageUrl = g.ImageUrl,
                    Category = g.Category,
                    IsPublic = g.IsPublic,
                    MemberCount = g.MemberCount,
                    CreatedAt = g.CreatedAt,
                    IsMember = true, // User is the owner, so definitely a member
                    IsFeatured = g.IsFeatured
                }).ToList();

                var response = new GroupsPagedResponse
                {
                    Items = groupDtos,
                    TotalCount = totalCount,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize),
                    CategoryCounts = groupDtos.GroupBy(g => g.Category)
                                           .ToDictionary(g => g.Key, g => g.Count()),
                    Stats = new GroupsStatsDto
                    {
                        TotalGroups = totalCount,
                        PublicGroups = groupDtos.Count(g => g.IsPublic),
                        PrivateGroups = groupDtos.Count(g => !g.IsPublic),
                        ActiveGroups = totalCount, // All owned groups are considered active
                        FeaturedGroups = groupDtos.Count(g => g.IsFeatured),
                        TotalMembers = groupDtos.Sum(g => g.MemberCount)
                    }
                };

                return Result<GroupsPagedResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<GroupsPagedResponse>.Failure($"Failed to retrieve owned groups: {ex.Message}");
            }
        }
    }
}
