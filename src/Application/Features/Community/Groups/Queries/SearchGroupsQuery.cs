using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class SearchGroupsQuery : IRequest<Result<GroupsPagedResponse>>
    {
        public string SearchTerm { get; set; } = string.Empty;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Category { get; set; }
        public bool? IsPublic { get; set; }
    }

    public class SearchGroupsQueryHandler : IRequestHandler<SearchGroupsQuery, Result<GroupsPagedResponse>>
    {
        private readonly IGroupRepository _groupRepository;

        public SearchGroupsQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<GroupsPagedResponse>> Handle(SearchGroupsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var pagedGroups = await _groupRepository.GetGroupsPagedAsync(
                    request.PageNumber,
                    request.PageSize,
                    request.Category,
                    request.SearchTerm,
                    "MemberCount", // Sort by member count for search results
                    true, // Descending
                    request.IsPublic,
                    true, // Only active groups
                    cancellationToken);

                var groupDtos = pagedGroups.Items.Select(g => new GroupSummaryDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Description = g.Description,
                    ImageUrl = g.ImageUrl,
                    Category = g.Category,
                    IsPublic = g.IsPublic,
                    MemberCount = g.MemberCount,
                    CreatedAt = g.CreatedAt,
                    IsMember = false, // TODO: Check if current user is member
                    IsFeatured = g.IsFeatured
                }).ToList();

                var response = new GroupsPagedResponse
                {
                    Items = groupDtos,
                    TotalCount = pagedGroups.TotalCount,
                    PageNumber = pagedGroups.PageNumber,
                    PageSize = pagedGroups.PageSize,
                    TotalPages = pagedGroups.TotalPages,
                    CategoryCounts = groupDtos.GroupBy(g => g.Category)
                                           .ToDictionary(g => g.Key, g => g.Count()),
                    Stats = new GroupsStatsDto
                    {
                        TotalGroups = pagedGroups.TotalCount,
                        PublicGroups = groupDtos.Count(g => g.IsPublic),
                        PrivateGroups = groupDtos.Count(g => !g.IsPublic),
                        ActiveGroups = pagedGroups.TotalCount, // All search results are active
                        FeaturedGroups = groupDtos.Count(g => g.IsFeatured),
                        TotalMembers = groupDtos.Sum(g => g.MemberCount)
                    }
                };

                return Result<GroupsPagedResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<GroupsPagedResponse>.Failure($"Failed to search groups: {ex.Message}");
            }
        }
    }
}