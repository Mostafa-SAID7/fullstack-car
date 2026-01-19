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
    public class BlockedUserDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public DateTime BlockedAt { get; set; }
    }

    public class FriendSuggestionDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public int MutualFriendsCount { get; set; }
        public string SuggestionReason { get; set; } = string.Empty;
    }

    public class FriendshipStatusDto
    {
        public string Status { get; set; } = string.Empty; // None, Pending, Friends, Blocked
        public bool CanSendRequest { get; set; }
        public bool IsBlocked { get; set; }
    }
