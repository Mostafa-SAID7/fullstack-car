using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetUserGroupsQuery : IRequest<Result<GroupsPagedResponse>>
    {
        public Guid UserId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Role { get; set; }
    }

    public class GetUserGroupsQueryHandler : IRequestHandler<GetUserGroupsQuery, Result<GroupsPagedResponse>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetUserGroupsQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<GroupsPagedResponse>> Handle(GetUserGroupsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var userGroups = await _groupRepository.GetUserGroupsAsync(request.UserId, request.Role, cancellationToken);

                // Apply pagination
                var totalCount = userGroups.Count();
                var pagedGroups = userGroups
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
                    IsMember = true, // User is definitely a member since we're getting their groups
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
                        ActiveGroups = totalCount, // All user groups are considered active
                        FeaturedGroups = groupDtos.Count(g => g.IsFeatured),
                        TotalMembers = groupDtos.Sum(g => g.MemberCount)
                    }
                };

                return Result<GroupsPagedResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<GroupsPagedResponse>.Failure($"Failed to retrieve user groups: {ex.Message}");
            }
        }
    }
}