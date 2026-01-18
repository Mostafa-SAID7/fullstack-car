namespace Application.Features.Admin.Security.DTOs;

public class SecuritySettingsDto
{
    public bool EnableTwoFactor { get; set; }
    public int PasswordMinLength { get; set; }
    public bool RequireSpecialCharacters { get; set; }
    public List<string> BlockedIpAddresses { get; set; } = new();
}