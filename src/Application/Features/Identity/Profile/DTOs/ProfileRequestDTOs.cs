namespace Application.Features.Identity.Profile.DTOs;

public class UpdateUserPreferencesRequest
{
    public string Language { get; set; } = string.Empty;
    public string Theme { get; set; } = string.Empty;
    public bool EmailNotifications { get; set; }
}

public class UpdateThemePreferenceRequest
{
    public string Theme { get; set; } = string.Empty;
}

public class UpdateLanguagePreferenceRequest
{
    public string Language { get; set; } = string.Empty;
}

public class UpdateCarInterestsRequest
{
    public List<string> CarBrands { get; set; } = new();
    public List<string> CarTypes { get; set; } = new();
}

public class UpdateProfileRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
}

public class UploadAvatarRequest
{
    public byte[] ImageData { get; set; } = Array.Empty<byte>();
    public string FileName { get; set; } = string.Empty;
}

public class UpdatePrivacySettingsRequest
{
    public bool ShowEmail { get; set; }
    public bool ShowPhone { get; set; }
    public bool ShowLocation { get; set; }
}

public class UpdateNotificationSettingsRequest
{
    public bool EmailNotifications { get; set; }
    public bool PushNotifications { get; set; }
    public bool SmsNotifications { get; set; }
}

public class DeactivateAccountRequest
{
    public string Reason { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class ExpertPreferencesDto
{
    public List<string> ExpertiseAreas { get; set; } = new();
    public bool ReceiveQuestionNotifications { get; set; }
    public bool AutoAcceptExpertRole { get; set; }
}
public class UserProfileDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool IsEmailVerified { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class PublicProfileDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public DateTime JoinedAt { get; set; }
    public int PostsCount { get; set; }
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
}

public class UpdateProfileRequestV2
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
}