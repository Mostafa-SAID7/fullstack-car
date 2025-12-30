namespace Application.Features.Identity.Profile.DTOs.Responses
{
    public class UserPrivacySettings
    {
        public bool IsEmailPublic { get; set; }
        public bool IsPhonePublic { get; set; }
        public bool AllowDirectMessages { get; set; }
        public bool ShowOnlineStatus { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}