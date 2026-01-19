using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using MediatR;

namespace Application.Features.Community.Groups.Queries
{
    public class GetGroupDiscussionsQuery : IRequest<Result<GroupDiscussionsPagedResponse>>
    {
        public Guid GroupId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Category { get; set; }
        public string? SortBy { get; set; } = "LastActivity";
        public bool SortDescending { get; set; } = true;
        public bool? IsPinned { get; set; }
    }

    public class GetGroupDiscussionsQueryHandler : IRequestHandler<GetGroupDiscussionsQuery, Result<GroupDiscussionsPagedResponse>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupDiscussionRepository _discussionRepository;

        public GetGroupDiscussionsQueryHandler(
            IGroupRepository groupRepository,
            IGroupDiscussionRepository discussionRepository)
        {
            _groupRepository = groupRepository;
            _discussionRepository = discussionRepository;
        }

        public async Task<Result<GroupDiscussionsPagedResponse>> Handle(GetGroupDiscussionsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate group exists
                var groupExists = await _groupRepository.ExistsAsync(request.GroupId, cancellationToken);
                if (!groupExists)
                {
                    return Result<GroupDiscussionsPagedResponse>.Failure("Group not found");
                }

                var pagedDiscussions = await _discussionRepository.GetGroupDiscussionsPagedAsync(
                    request.GroupId,
                    request.PageNumber,
                    request.PageSize,
                    request.Category,
                    request.SortBy,
                    request.SortDescending,
                    request.IsPinned,
                    cancellationToken);

                var discussionDtos = pagedDiscussions.Items.Select(d => new GroupDiscussionSummaryDto
                {
                    Id = d.Id,
                    GroupId = d.GroupId,
                    Title = d.Title,
                    Content = d.Content.Length > 200 ? d.Content.Substring(0, 200) + "..." : d.Content,
                    Category = d.Category,
                    Tags = new List<string>(), // TODO: Implement tags
                    IsPinned = d.IsPinned,
                    IsLocked = d.IsLocked,
                    IsPoll = d.IsPoll,
                    CreatedAt = d.CreatedAt,
                    LastActivity = d.LastActivity,
                    CreatedBy = new GroupMemberDto
                    {
                        Id = Guid.NewGuid(), // TODO: Get actual member data
                        UserId = d.CreatedBy,
                        Username = "Unknown", // TODO: Get username
                        DisplayName = "Unknown"
                    },
                    ReplyCount = d.ReplyCount,
                    ViewCount = d.ViewCount,
                    LikeCount = d.LikeCount,
                    HasUserReplied = false, // TODO: Check if current user replied
                    HasUserLiked = false // TODO: Check if current user liked
                }).ToList();

                var response = new GroupDiscussionsPagedResponse
                {
                    Items = discussionDtos,
                    TotalCount = pagedDiscussions.TotalCount,
                    PageNumber = pagedDiscussions.PageNumber,
                    PageSize = pagedDiscussions.PageSize,
                    TotalPages = pagedDiscussions.TotalPages,
                    CategoryCounts = new Dictionary<string, int>(), // TODO: Implement
                    Stats = new DiscussionOverallStatsDto
                    {
                        TotalDiscussions = pagedDiscussions.TotalCount,
                        ActiveDiscussions = discussionDtos.Count(d => d.LastActivity > DateTime.UtcNow.AddDays(-7)),
                        PinnedDiscussions = discussionDtos.Count(d => d.IsPinned),
                        LockedDiscussions = discussionDtos.Count(d => d.IsLocked),
                        PollDiscussions = discussionDtos.Count(d => d.IsPoll),
                        TotalReplies = discussionDtos.Sum(d => d.ReplyCount),
                        LastActivity = discussionDtos.Max(d => d.LastActivity)
                    }
                };

                return Result<GroupDiscussionsPagedResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<GroupDiscussionsPagedResponse>.Failure($"Failed to retrieve group discussions: {ex.Message}");
            }
        }
    }
}
