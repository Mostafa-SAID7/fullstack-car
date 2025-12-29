namespace Application.Features.Community.Friends.DTOs
{
    public class FriendDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public DateTime FriendsSince { get; set; }
    }

    public class FriendRequestDto
    {
        public Guid id { get; set; } // The UserFriend record ID
        public Guid RequesterId { get; set; }
        public string RequesterFirstName { get; set; } = string.Empty;
        public string RequesterLastName { get; set; } = string.Empty;
        public string? RequesterProfileImageUrl { get; set; }
        public DateTime RequestedAt { get; set; }
    }
}
