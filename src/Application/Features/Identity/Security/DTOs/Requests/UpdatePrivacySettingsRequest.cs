namespace Application.Features.Identity.Security.DTOs.Requests
{
    public class UpdatePrivacySettingsRequest
    {
        public bool IsEmailPublic { get; set; }
        public bool IsPhonePublic { get; set; }
        public bool AllowDirectMessages { get; set; }
        public bool ShowOnlineStatus { get; set; }
    }
}