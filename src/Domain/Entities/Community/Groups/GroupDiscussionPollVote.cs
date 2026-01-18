using Domain.Base;
using Domain.Entities.Identity;

namespace Domain.Entities.Community.Groups
{
    public class GroupDiscussionPollVote : BaseEntity
    {
        public Guid PollOptionId { get; set; }
        public Guid UserId { get; set; }
        public DateTime VotedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual GroupDiscussionPollOption PollOption { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
}