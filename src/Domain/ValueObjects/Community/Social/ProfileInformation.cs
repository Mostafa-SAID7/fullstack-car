using Domain.Base;
using System.Text.RegularExpressions;

namespace Domain.ValueObjects.Community.Social
{
    public class ProfileInformation : ValueObject
    {
        public string Bio { get; private set; }
        public string? Location { get; private set; }
        public string? Website { get; private set; }
        public DateTime? DateOfBirth { get; private set; }
        public string? ProfileImageUrl { get; private set; }
        public string? CoverImageUrl { get; private set; }

        private ProfileInformation() 
        {
            Bio = string.Empty;
        }

        public ProfileInformation(
            string bio,
            string? location = null,
            string? website = null,
            DateTime? dateOfBirth = null,
            string? profileImageUrl = null,
            string? coverImageUrl = null)
        {
            Bio = ValidateBio(bio);
            Location = ValidateLocation(location);
            Website = ValidateWebsite(website);
            DateOfBirth = ValidateDateOfBirth(dateOfBirth);
            ProfileImageUrl = ValidateImageUrl(profileImageUrl);
            CoverImageUrl = ValidateImageUrl(coverImageUrl);
        }

        public static ProfileInformation CreateEmpty()
        {
            return new ProfileInformation(string.Empty);
        }

        public ProfileInformation UpdateBio(string bio)
        {
            return new ProfileInformation(bio, Location, Website, DateOfBirth, ProfileImageUrl, CoverImageUrl);
        }

        public ProfileInformation UpdateLocation(string? location)
        {
            return new ProfileInformation(Bio, location, Website, DateOfBirth, ProfileImageUrl, CoverImageUrl);
        }

        public ProfileInformation UpdateWebsite(string? website)
        {
            return new ProfileInformation(Bio, Location, website, DateOfBirth, ProfileImageUrl, CoverImageUrl);
        }

        public ProfileInformation UpdateDateOfBirth(DateTime? dateOfBirth)
        {
            return new ProfileInformation(Bio, Location, Website, dateOfBirth, ProfileImageUrl, CoverImageUrl);
        }

        public ProfileInformation UpdateProfileImage(string? profileImageUrl)
        {
            return new ProfileInformation(Bio, Location, Website, DateOfBirth, profileImageUrl, CoverImageUrl);
        }

        public ProfileInformation UpdateCoverImage(string? coverImageUrl)
        {
            return new ProfileInformation(Bio, Location, Website, DateOfBirth, ProfileImageUrl, coverImageUrl);
        }

        public int? GetAge()
        {
            if (!DateOfBirth.HasValue)
                return null;

            var today = DateTime.Today;
            var age = today.Year - DateOfBirth.Value.Year;
            
            if (DateOfBirth.Value.Date > today.AddYears(-age))
                age--;
                
            return age;
        }

        public bool IsProfileComplete()
        {
            return !string.IsNullOrWhiteSpace(Bio) &&
                   !string.IsNullOrWhiteSpace(Location) &&
                   !string.IsNullOrWhiteSpace(ProfileImageUrl);
        }

        private static string ValidateBio(string bio)
        {
            if (bio == null)
                return string.Empty;

            bio = bio.Trim();
            
            if (bio.Length > 500)
                throw new ArgumentException("Bio cannot exceed 500 characters");

            // Remove potentially harmful content
            bio = Regex.Replace(bio, @"<[^>]*>", string.Empty); // Remove HTML tags
            
            return bio;
        }

        private static string? ValidateLocation(string? location)
        {
            if (string.IsNullOrWhiteSpace(location))
                return null;

            location = location.Trim();
            
            if (location.Length > 100)
                throw new ArgumentException("Location cannot exceed 100 characters");

            return location;
        }

        private static string? ValidateWebsite(string? website)
        {
            if (string.IsNullOrWhiteSpace(website))
                return null;

            website = website.Trim();
            
            // First check for obviously invalid formats
            if (website.Contains(" ") || !website.Contains("."))
            {
                throw new ArgumentException("Invalid website URL format");
            }
            
            Uri? uri = null;
            bool isValidUri = false;
            
            // If it doesn't start with http/https, add https
            if (!website.StartsWith("http://") && !website.StartsWith("https://"))
            {
                var httpsWebsite = "https://" + website;
                isValidUri = Uri.TryCreate(httpsWebsite, UriKind.Absolute, out uri);
                if (isValidUri && uri != null && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
                {
                    website = httpsWebsite;
                }
                else
                {
                    throw new ArgumentException("Invalid website URL format");
                }
            }
            else
            {
                // For URLs that already have a scheme, validate them directly
                isValidUri = Uri.TryCreate(website, UriKind.Absolute, out uri);
                
                // Explicitly reject non-HTTP/HTTPS schemes
                if (isValidUri && uri != null && uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)
                {
                    throw new ArgumentException("Invalid website URL format");
                }
            }

            // Validate the URI and ensure it's HTTP/HTTPS only
            if (!isValidUri || uri == null || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
            {
                throw new ArgumentException("Invalid website URL format");
            }

            // Normalize http to https
            if (uri.Scheme == Uri.UriSchemeHttp)
            {
                website = website.Replace("http://", "https://");
            }

            if (website.Length > 500)
                throw new ArgumentException("Website URL cannot exceed 500 characters");

            return website;
        }

        private static DateTime? ValidateDateOfBirth(DateTime? dateOfBirth)
        {
            if (!dateOfBirth.HasValue)
                return null;

            var today = DateTime.Today;
            var minDate = today.AddYears(-120); // Maximum age of 120 years
            var maxDate = today.AddYears(-13);  // Minimum age of 13 years

            if (dateOfBirth.Value.Date < minDate)
                throw new ArgumentException("Date of birth cannot be more than 120 years ago");

            if (dateOfBirth.Value.Date > maxDate)
                throw new ArgumentException("User must be at least 13 years old");

            return dateOfBirth.Value.Date;
        }

        private static string? ValidateImageUrl(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return null;

            imageUrl = imageUrl.Trim();

            if (!Uri.TryCreate(imageUrl, UriKind.Absolute, out Uri? uri) || 
                (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
            {
                throw new ArgumentException("Invalid image URL format");
            }

            if (imageUrl.Length > 2048)
                throw new ArgumentException("Image URL cannot exceed 2048 characters");

            return imageUrl;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Bio;
            yield return Location ?? string.Empty;
            yield return Website ?? string.Empty;
            yield return DateOfBirth?.Date ?? DateTime.MinValue;
            yield return ProfileImageUrl ?? string.Empty;
            yield return CoverImageUrl ?? string.Empty;
        }
    }
}