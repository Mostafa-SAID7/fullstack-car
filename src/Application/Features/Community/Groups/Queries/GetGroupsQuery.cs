using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
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
    }

    public class GetGroupsQueryHandler : IRequestHandler<GetGroupsQuery, Result<GroupsPagedResponse>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetGroupsQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
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
                    FeaturedGroups = await _groupRepository.GetFeaturedGroupCountAsync(cancellationToken)
                }
            };

            return Result<GroupsPagedResponse>.Success(response);
        }
    }
}