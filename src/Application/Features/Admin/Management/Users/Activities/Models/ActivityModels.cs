namespace Application.Features.Admin.Management.Users.Activities.Models
{
    public class UserActivity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string ActivityType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class UserActivitySummary
    {
        public int TotalActivities { get; set; }
        public int PostsCreated { get; set; }
        public int CommentsPosted { get; set; }
        public int GroupsJoined { get; set; }
        public int ReviewsWritten { get; set; }
        public DateTime LastActivity { get; set; }
        public Dictionary<string, int> ActivitiesByType { get; set; } = new();
        public Dictionary<string, int> ActivitiesByDay { get; set; } = new();
    }

    public class UserActivityTimelineItem
    {
        public Guid Id { get; set; }
        public string ActivityType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class UserActivityStats
    {
        public int TotalActivities { get; set; }
        public double AverageActivitiesPerDay { get; set; }
        public string MostActiveDay { get; set; } = string.Empty;
        public string MostActiveHour { get; set; } = string.Empty;
        public List<ActivityTypeStats> ActivityTypes { get; set; } = new();
    }

    public class ActivityTypeStats
    {
        public string Type { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}
