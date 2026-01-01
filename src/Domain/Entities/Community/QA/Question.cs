using Domain.Base;
using Domain.Enums.Community.QA;
using Domain.Entities.Identity;
using Domain.Entities.Community.Groups;

namespace Domain.Entities.Community.QA
{
    public class Question : BaseAuditableEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public QuestionStatus Status { get; set; } = QuestionStatus.Open;
        public QuestionPriority Priority { get; set; } = QuestionPriority.Normal;
        public int ViewsCount { get; set; } = 0;
        public int UpvotesCount { get; set; } = 0;
        public int DownvotesCount { get; set; } = 0;
        public int AnswersCount { get; set; } = 0;
        public bool HasAcceptedAnswer { get; set; } = false;
        public Guid? AcceptedAnswerId { get; set; }
        public string? Tags { get; set; } // JSON array of tags
        public int BountyAmount { get; set; } = 0;
        public DateTime? BountyExpiresAt { get; set; }

        // Foreign Keys
        public Guid UserId { get; set; }
        public Guid? GroupId { get; set; }
        public Guid? CategoryId { get; set; }

        // Navigation Properties
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual Group? Group { get; set; }
        public virtual QuestionCategory? Category { get; set; }
        public virtual Answer? AcceptedAnswer { get; set; }
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
        public virtual ICollection<QuestionVote> Votes { get; set; } = new List<QuestionVote>();
        public virtual ICollection<QuestionView> Views { get; set; } = new List<QuestionView>();
        public virtual ICollection<QuestionBookmark> Bookmarks { get; set; } = new List<QuestionBookmark>();
        public virtual ICollection<QuestionTag> QuestionTags { get; set; } = new List<QuestionTag>();
    }
}