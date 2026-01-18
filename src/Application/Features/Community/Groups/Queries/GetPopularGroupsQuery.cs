using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetPopularGroupsQuery : IRequest<Result<List<GroupSummaryDto>>>
    {
        public int Count { get; set; } = 10;
        public int PageSize { get; set; } = 10;
    }

    public class GetPopularGroupsQueryHandler : IRequestHandler<GetPopularGroupsQuery, Result<List<GroupSummaryDto>>>
    {
        private readonly IGroupRepository _groupRepository;

        public GetPopularGroupsQueryHandler(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<List<GroupSummaryDto>>> Handle(GetPopularGroupsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var popularGroups = await _groupRepository.GetPopularGroupsAsync(request.Count, cancellationToken);

                var groupDtos = popularGroups.Select(g => new GroupSummaryDto
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
                return Result<List<GroupSummaryDto>>.Failure($"Failed to retrieve popular groups: {ex.Message}");
            }
        }
    }
}