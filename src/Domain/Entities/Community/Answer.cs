using Domain.Base;
using Domain.Enums.Community.QA;
using Domain.Entities.Identity;

namespace Domain.Entities.Community
{
    public class Answer : BaseAuditableEntity
    {
        public string Content { get; set; } = string.Empty;
        public AnswerStatus Status { get; set; } = AnswerStatus.Active;
        public int UpvotesCount { get; set; } = 0;
        public int DownvotesCount { get; set; } = 0;
        public bool IsAccepted { get; set; } = false;
        public DateTime? AcceptedAt { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsVerified { get; set; } = false;
        public string? VerificationSource { get; set; }

        // Foreign Keys
        public Guid QuestionId { get; set; }
        public Guid UserId { get; set; }
        public Guid? ParentAnswerId { get; set; } // For threaded answers

        // Navigation Properties
        public virtual Question Question { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual Answer? ParentAnswer { get; set; }
        public virtual ICollection<Answer> ChildAnswers { get; set; } = new List<Answer>();
        public virtual ICollection<AnswerVote> Votes { get; set; } = new List<AnswerVote>();
        public virtual ICollection<AnswerComment> Comments { get; set; } = new List<AnswerComment>();
        public virtual ICollection<AnswerHistory> VersionHistory { get; set; } = new List<AnswerHistory>();
    }
}
