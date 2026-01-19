namespace Domain.Enums.Common
{
    public enum ContentType
    {
        None = 0,
        
        // Community Content
        Post = 1,
        Question = 2,
        Answer = 3,
        Comment = 4,
        Article = 5,
        Guide = 6,
        Event = 7,
        Group = 8,
        Page = 18,
        
        // Marketplace
        Product = 9,
        Service = 10,
        
        // Media
        Video = 12,
        Podcast = 13,
        
        // Others
        Location = 11,
        User = 14,
        Review = 15,
        Badge = 16,
        CheckIn = 17
    }

    public enum VoteType
    {
        Up = 1,
        Down = 2
    }

    public enum ReactionType
    {
        Like = 1,
        Love = 2,
        Haha = 3,
        Wow = 4,
        Sad = 5,
        Angry = 6
    }

    public enum CommonStatus
    {
        Active = 1,
        Inactive = 2,
        Pending = 3,
        Suspended = 4,
        Archived = 5,
        Deleted = 6
    }
}
