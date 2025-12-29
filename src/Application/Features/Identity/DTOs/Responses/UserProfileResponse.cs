namespace Application.Features.Identity.DTOs.Responses
{
    public class UserProfileResponse
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}".Trim();
        public string? ProfileImageUrl { get; set; }
        public string? Bio { get; set; }
        public bool IsEmailConfirmed { get; set; }
        public bool IsTwoFactorEnabled { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
