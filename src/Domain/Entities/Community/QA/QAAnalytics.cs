using Domain.Base;

namespace Domain.Entities.Community.QA
{
    public class QAAnalytics : BaseEntity
    {
        public DateTime Date { get; set; }
        public int QuestionsAsked { get; set; } = 0;
        public int QuestionsAnswered { get; set; } = 0;
        public int AnswersAccepted { get; set; } = 0;
        public int TotalVotes { get; set; } = 0;
        public int UniqueUsers { get; set; } = 0;
        public int AverageResponseTime { get; set; } = 0; // in minutes
        public string? TopCategory { get; set; }
    }
}