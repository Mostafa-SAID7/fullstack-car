namespace Application.Features.Admin.Security.DTOs;

public class UpdateSecuritySettingsRequest
{
    public PasswordPolicySettings? PasswordPolicy { get; set; }
    public TwoFactorAuthSettings? TwoFactorAuth { get; set; }
    public SessionManagementSettings? SessionManagement { get; set; }
    public IpBlockingSettings? IpBlocking { get; set; }
}

public class PasswordPolicySettings
{
    public int MinLength { get; set; } = 8;
    public int MaxLength { get; set; } = 128;
    public bool RequireUppercase { get; set; } = true;
    public bool RequireLowercase { get; set; } = true;
    public bool RequireNumbers { get; set; } = true;
    public bool RequireSpecialCharacters { get; set; } = true;
    public bool PreventPasswordReuse { get; set; } = true;
    public int PasswordHistoryCount { get; set; } = 5;
    public int PasswordExpirationDays { get; set; } = 90;
}

public class TwoFactorAuthSettings
{
    public bool IsEnforced { get; set; } = false;
    public string[] AllowedMethods { get; set; } = Array.Empty<string>();
    public int BackupCodesCount { get; set; } = 10;
}

public class SessionManagementSettings
{
    public int SessionTimeoutMinutes { get; set; } = 30;
    public int MaxConcurrentSessions { get; set; } = 5;
    public bool EnableSessionTracking { get; set; } = true;
}

public class IpBlockingSettings
{
    public bool EnableAutoBlocking { get; set; } = true;
    public int MaxFailedAttempts { get; set; } = 5;
    public int BlockDurationMinutes { get; set; } = 30;
    public string[] WhitelistedIpAddresses { get; set; } = Array.Empty<string>();
}

public class BlockIpAddressRequest
{
    public string IpAddress { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTime? ExpiresAt { get; set; }
    public bool IsPermanent { get; set; } = false;
}

public class UpdatePasswordPolicyRequest
{
    public int MinLength { get; set; } = 8;
    public int MaxLength { get; set; } = 128;
    public bool RequireUppercase { get; set; } = true;
    public bool RequireLowercase { get; set; } = true;
    public bool RequireNumbers { get; set; } = true;
    public bool RequireSpecialCharacters { get; set; } = true;
    public bool PreventPasswordReuse { get; set; } = true;
    public int PasswordHistoryCount { get; set; } = 5;
    public int PasswordExpirationDays { get; set; } = 90;
}

public class EnforceTwoFactorRequest
{
    public bool IsEnforced { get; set; }
    public string[] AllowedMethods { get; set; } = Array.Empty<string>();
    public string[] ExemptRoles { get; set; } = Array.Empty<string>();
    public DateTime? EffectiveDate { get; set; }
}