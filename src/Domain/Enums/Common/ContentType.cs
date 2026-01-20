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
        Story = 19,
        
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
}
