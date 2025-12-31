using System.ComponentModel.DataAnnotations;
using Domain.Enums.Identity;

namespace Application.Features.Identity.Profile.DTOs.Requests
{
    public class UpdateProfileRequest
    {
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Bio { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }

        [Url]
        public string? Website { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public Gender? Gender { get; set; }

        [MaxLength(10)]
        public string? LanguagePreference { get; set; }

        [MaxLength(50)]
        public string? TimeZone { get; set; }

        [MaxLength(50)]
        public string? TwitterHandle { get; set; }

        [Url]
        public string? LinkedInProfile { get; set; }

        [Url]
        public string? GitHubProfile { get; set; }

        // Privacy Settings
        public bool IsProfilePublic { get; set; } = true;
        public bool ShowEmail { get; set; } = false;
        public bool ShowPhoneNumber { get; set; } = false;

        // Notification Settings
        public bool EmailNotifications { get; set; } = true;
        public bool PushNotifications { get; set; } = true;
        public bool SmsNotifications { get; set; } = false;
    }
}
