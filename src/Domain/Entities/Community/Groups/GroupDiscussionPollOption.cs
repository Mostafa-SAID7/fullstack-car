using Domain.Base;

namespace Domain.Entities.Community.Groups
{
    public class GroupDiscussionPollOption : BaseEntity
    {
        public Guid DiscussionId { get; set; }
        public string Text { get; set; } = string.Empty;
        public int VoteCount { get; set; } = 0;
        public int SortOrder { get; set; } = 0;

        // Navigation Properties
        public virtual GroupDiscussion Discussion { get; set; } = null!;
        public virtual ICollection<GroupDiscussionPollVote> Votes { get; set; } = new List<GroupDiscussionPollVote>();
    }
}