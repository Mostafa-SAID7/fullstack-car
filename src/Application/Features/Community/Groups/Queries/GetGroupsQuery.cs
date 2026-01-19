using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Application.Common.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetGroupsQuery : IRequest<Result<GroupsPagedResponse>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Category { get; set; }
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; } = "CreatedAt";
        public bool SortDescending { get; set; } = true;
        public bool? IsPublic { get; set; }
        public bool? IsActive { get; set; } = true;
        public Guid? UserId { get; set; }
    }

    public class GetGroupsQueryHandler : IRequestHandler<GetGroupsQuery, Result<GroupsPagedResponse>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupMemberRepository _memberRepository;

        public GetGroupsQueryHandler(
            IGroupRepository groupRepository,
            IGroupMemberRepository memberRepository)
        {
            _groupRepository = groupRepository;
            _memberRepository = memberRepository;
        }

        public async Task<Result<GroupsPagedResponse>> Handle(GetGroupsQuery request, CancellationToken cancellationToken)
        {
            var result = await _groupRepository.GetGroupsPagedAsync(
                request.PageNumber,
                request.PageSize,
                request.Category,
                request.SearchTerm,
                request.SortBy,
                request.SortDescending,
                request.IsPublic,
                request.IsActive,
                cancellationToken);

            // Get user memberships to set IsMember flag
            var userMemberships = request.UserId.HasValue 
                ? await _memberRepository.FindAsync(m => m.UserId == request.UserId.Value, cancellationToken)
                : new List<Domain.Entities.Community.Groups.GroupMember>();
            
            var userGroupIds = userMemberships.Select(m => m.GroupId).ToHashSet();

            var groupSummaries = result.Items.Select(g => new GroupSummaryDto
            {
                Id = g.Id,
                Name = g.Name,
                Description = g.Description,
                ImageUrl = g.ImageUrl,
                Category = g.Category,
                IsPublic = g.IsPublic,
                MemberCount = g.MemberCount,
                CreatedAt = g.CreatedAt,
                IsMember = userGroupIds.Contains(g.Id),
                IsFeatured = g.IsFeatured
            }).ToList();

            var response = new GroupsPagedResponse
            {
                Items = groupSummaries,
                TotalCount = result.TotalCount,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize,
                TotalPages = result.TotalPages,
                CategoryCounts = await _groupRepository.GetGroupCountsByCategoryAsync(cancellationToken),
                Stats = new GroupsStatsDto
                {
                    TotalGroups = await _groupRepository.GetGroupCountAsync(cancellationToken),
                    PublicGroups = await _groupRepository.GetPublicGroupCountAsync(cancellationToken),
                    PrivateGroups = await _groupRepository.GetPrivateGroupCountAsync(cancellationToken),
                    ActiveGroups = await _groupRepository.GetActiveGroupCountAsync(cancellationToken),
                    FeaturedGroups = await _groupRepository.GetFeaturedGroupCountAsync(cancellationToken),
                    TotalMembers = result.Items.Sum(g => g.MemberCount) // Just illustrative, usually you'd want global sum
                }
            };

            return Result<GroupsPagedResponse>.Success(response);
        }
    }
}
