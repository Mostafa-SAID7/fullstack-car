namespace Application.Features.Identity.Security.DTOs.Responses
{
    public class TwoFactorSetupResponse
    {
        public string SharedKey { get; set; } = string.Empty;
        public string AuthenticatorUri { get; set; } = string.Empty;
        public string QrCodeUri { get; set; } = string.Empty;
        public List<string> RecoveryCodes { get; set; } = new();
    }
}