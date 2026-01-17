namespace Application.Features.Identity.OAuth.DTOs.Responses
{
    public class OAuthInitiationResponse
    {
        public string AuthorizationUrl { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Provider { get; set; } = string.Empty;
        public string RedirectUri { get; set; } = string.Empty;
    }
}