using Domain.Base;

namespace Domain.Entities.Community.QA
{
    public class Analytics : BaseEntity
    {
        public DateTime Date { get; set; }
        public int QuestionsAsked { get; set; }
        public int AnswersGiven { get; set; }
        public int VotesCast { get; set; }
        public int AcceptedAnswers { get; set; }
        public double AverageResponseTime { get; set; }
        public string TopCategory { get; set; } = string.Empty;
        public int ActiveUsers { get; set; }
        public int NewUsers { get; set; }
        public double UserEngagement { get; set; }
        public string? AdditionalMetrics { get; set; }
    }
}