using Application.Common.Models;
using Application.Features.Community.Groups.DTOs;
using Domain.Entities.Community.Groups;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetGroupsStatsQuery : IRequest<Result<GroupsStatsDto>>
    {
        public string? Category { get; set; }
        public bool? IsPublic { get; set; }
        public bool? IsActive { get; set; }
    }

    public class GetGroupsStatsQueryHandler : IRequestHandler<GetGroupsStatsQuery, Result<GroupsStatsDto>>
    {
        private readonly IRepository<Group> _groupRepository;

        public GetGroupsStatsQueryHandler(IRepository<Group> groupRepository)
        {
            _groupRepository = groupRepository;
        }

        public async Task<Result<GroupsStatsDto>> Handle(GetGroupsStatsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var groups = await _groupRepository.GetAllAsync(cancellationToken);

                if (!string.IsNullOrEmpty(request.Category))
                {
                    groups = groups.Where(g => g.Category == request.Category);
                }

                if (request.IsPublic.HasValue)
                {
                    groups = groups.Where(g => g.IsPublic == request.IsPublic.Value);
                }

                if (request.IsActive.HasValue)
                {
                    groups = groups.Where(g => g.IsActive == request.IsActive.Value);
                }

                var groupsList = groups.ToList();
                var oneWeekAgo = DateTime.UtcNow.AddDays(-7);

                var stats = new GroupsStatsDto
                {
                    TotalGroups = groupsList.Count,
                    PublicGroups = groupsList.Count(g => g.IsPublic),
                    PrivateGroups = groupsList.Count(g => !g.IsPublic),
                    ActiveGroups = groupsList.Count(g => g.IsActive),
                    FeaturedGroups = groupsList.Count(g => g.IsFeatured),
                    TotalMembers = groupsList.Sum(g => g.MemberCount),
                    NewGroupsThisWeek = groupsList.Count(g => g.CreatedAt >= oneWeekAgo)
                };

                return Result<GroupsStatsDto>.Success(stats);
            }
            catch (Exception ex)
            {
                return Result<GroupsStatsDto>.Failure($"Failed to get groups stats: {ex.Message}");
            }
        }
    }
}