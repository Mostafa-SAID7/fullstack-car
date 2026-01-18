using Application.Common.DTOs;
using Application.Features.Community.Groups.DTOs;
using Application.Features.Community.Groups.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Community.Groups;
using MediatR;

namespace Application.Features.Community.Groups.Commands
{
    public class CreateGroupDiscussionCommand : IRequest<Result<GroupDiscussionDto>>
    {
        public Guid GroupId { get; set; }
        public Guid CreatedBy { get; set; }
        public CreateGroupDiscussionRequest Request { get; set; } = new();
    }

    public class CreateGroupDiscussionCommandHandler : IRequestHandler<CreateGroupDiscussionCommand, Result<GroupDiscussionDto>>
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IGroupMemberRepository _memberRepository;
        private readonly IGroupDiscussionRepository _discussionRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public CreateGroupDiscussionCommandHandler(
            IGroupRepository groupRepository,
            IGroupMemberRepository memberRepository,
            IGroupDiscussionRepository discussionRepository,
            INotificationService notificationService,
            IUnitOfWork unitOfWork)
        {
            _groupRepository = groupRepository;
            _memberRepository = memberRepository;
            _discussionRepository = discussionRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<GroupDiscussionDto>> Handle(CreateGroupDiscussionCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate group exists
                var group = await _groupRepository.GetByIdAsync(request.GroupId, cancellationToken);
                if (group == null)
                {
                    return Result<GroupDiscussionDto>.Failure("Group not found");
                }

                // Check if user is a member
                var isMember = await _memberRepository.IsMemberAsync(request.GroupId, request.CreatedBy, cancellationToken);
                if (!isMember)
                {
                    return Result<GroupDiscussionDto>.Failure("You must be a group member to create discussions");
                }

                // Create discussion entity
                var discussion = new GroupDiscussion
                {
                    Id = Guid.NewGuid(),
                    GroupId = request.GroupId,
                    Title = request.Request.Title,
                    Content = request.Request.Content,
                    Category = request.Request.Category,
                    IsPoll = request.Request.IsPoll,
                    AllowMultipleVotes = request.Request.AllowMultipleVotes,
                    PollExpiresAt = request.Request.PollExpiresAt,
                    CreatedBy = request.CreatedBy,
                    CreatedAt = DateTime.UtcNow,
                    LastActivity = DateTime.UtcNow,
                    ViewCount = 0,
                    ReplyCount = 0,
                    LikeCount = 0
                };

                await _discussionRepository.AddAsync(discussion, cancellationToken);

                // Create poll options if it's a poll
                if (request.Request.IsPoll && request.Request.PollOptions?.Any() == true)
                {
                    var pollOptions = request.Request.PollOptions.Select(option => new GroupDiscussionPollOption
                    {
                        Id = Guid.NewGuid(),
                        DiscussionId = discussion.Id,
                        Text = option,
                        VoteCount = 0,
                        CreatedAt = DateTime.UtcNow
                    }).ToList();

                    foreach (var option in pollOptions)
                    {
                        await _discussionRepository.AddPollOptionAsync(option, cancellationToken);
                    }
                }

                // Update group last activity
                group.LastActivity = DateTime.UtcNow;
                await _groupRepository.UpdateAsync(group, cancellationToken);

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Send notifications
                await _notificationService.NotifyDiscussionCreatedAsync(
                    request.GroupId,
                    discussion.Id,
                    discussion.Title,
                    request.CreatedBy,
                    "Creator Name"); // TODO: Get creator name

                // Map to DTO
                var discussionDto = new GroupDiscussionDto
                {
                    Id = discussion.Id,
                    GroupId = discussion.GroupId,
                    GroupName = group.Name,
                    Title = discussion.Title,
                    Content = discussion.Content,
                    Category = discussion.Category,
                    Tags = request.Request.Tags,
                    IsPinned = false,
                    IsLocked = false,
                    IsPoll = discussion.IsPoll,
                    PollOptions = new List<PollOptionDto>(),
                    CreatedAt = discussion.CreatedAt,
                    LastActivity = discussion.LastActivity,
                    Stats = new DiscussionStatsDto
                    {
                        ReplyCount = 0,
                        ViewCount = 0,
                        LikeCount = 0,
                        ParticipantCount = 1
                    },
                    RecentReplies = new List<DiscussionReplyDto>()
                };

                return Result<GroupDiscussionDto>.Success(discussionDto);
            }
            catch (Exception ex)
            {
                return Result<GroupDiscussionDto>.Failure($"Failed to create group discussion: {ex.Message}");
            }
        }
    }
}