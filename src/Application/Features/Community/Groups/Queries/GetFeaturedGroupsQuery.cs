using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetFeaturedGroupsQuery : IRequest<Result<List<GroupSummaryDto>>>
    {
        public int PageSize { get; set; } = 6;
    }

    public class GetFeaturedGroupsQueryHandler : IRequestHandler<GetFeaturedGroupsQuery, Result<List<GroupSummaryDto>>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetFeaturedGroupsQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<List<GroupSummaryDto>>> Handle(GetFeaturedGroupsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var featuredGroups = await _groupRepository.GetFeaturedGroupsAsync(request.PageSize, cancellationToken);

                var groupDtos = featuredGroups.Select(g => new GroupSummaryDto
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

                return Result<List<GroupSummaryDto>>.Success(groupDtos);
            }
            catch (Exception ex)
            {
                return Result<List<GroupSummaryDto>>.Failure($"Failed to retrieve featured groups: {ex.Message}");
            }
        }
    }
}