namespace Application.Features.Identity.OAuth.DTOs.Responses
{
    public class ExternalLoginInfo
    {
        public string Provider { get; set; } = string.Empty;
        public string ProviderKey { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string? Email { get; set; }
        public DateTime LinkedAt { get; set; }
        public bool IsActive { get; set; }
    }
}