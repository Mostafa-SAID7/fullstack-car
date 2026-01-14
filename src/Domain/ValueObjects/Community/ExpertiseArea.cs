using Domain.Base;

namespace Domain.ValueObjects.Community
{
    public class ExpertiseArea : ValueObject
    {
        public string Category { get; private set; }
        public string DisplayName { get; private set; }
        public int AnswerCount { get; private set; }
        public int AcceptedAnswerCount { get; private set; }
        public decimal AverageRating { get; private set; }
        public decimal ResponseRate { get; private set; }
        public DateTime LastActivity { get; private set; }
        public bool IsVerified { get; private set; }

        private ExpertiseArea()
        {
            Category = string.Empty;
            DisplayName = string.Empty;
        } // For EF Core

        public ExpertiseArea(
            string category, 
            string displayName, 
            int answerCount = 0, 
            int acceptedAnswerCount = 0, 
            decimal averageRating = 0m, 
            decimal responseRate = 0m, 
            bool isVerified = false)
        {
            Category = category ?? throw new ArgumentNullException(nameof(category));
            DisplayName = displayName ?? throw new ArgumentNullException(nameof(displayName));
            AnswerCount = answerCount;
            AcceptedAnswerCount = acceptedAnswerCount;
            AverageRating = averageRating;
            ResponseRate = responseRate;
            LastActivity = DateTime.UtcNow;
            IsVerified = isVerified;
        }

        public ExpertiseArea UpdateStats(int newAnswerCount, int newAcceptedCount, decimal newRating, decimal newResponseRate)
        {
            return new ExpertiseArea(
                Category,
                DisplayName,
                newAnswerCount,
                newAcceptedCount,
                newRating,
                newResponseRate,
                IsVerified
            );
        }

        public ExpertiseArea MarkAsVerified()
        {
            return new ExpertiseArea(
                Category,
                DisplayName,
                AnswerCount,
                AcceptedAnswerCount,
                AverageRating,
                ResponseRate,
                true
            );
        }

        public ExpertiseArea RecordActivity()
        {
            var updated = new ExpertiseArea(
                Category,
                DisplayName,
                AnswerCount,
                AcceptedAnswerCount,
                AverageRating,
                ResponseRate,
                IsVerified
            );
            
            // Use reflection to set LastActivity since it's private set
            typeof(ExpertiseArea)
                .GetProperty(nameof(LastActivity))!
                .SetValue(updated, DateTime.UtcNow);
                
            return updated;
        }

        public bool IsExpertLevel => AcceptedAnswerCount >= 10 && AverageRating >= 4.0m && ResponseRate >= 70m;
        public bool IsMasterLevel => AcceptedAnswerCount >= 50 && AverageRating >= 4.5m && ResponseRate >= 85m;

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Category;
            yield return DisplayName;
        }
    }
}