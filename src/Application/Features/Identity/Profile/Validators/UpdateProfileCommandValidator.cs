using Application.Common.Validators;
using Application.Features.Identity.Profile.Commands;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Features.Identity.Profile.Validators
{
    public class UpdateProfileCommandValidator : BaseValidator<UpdateProfileCommand>
    {
        public UpdateProfileCommandValidator(ILogger<UpdateProfileCommandValidator> logger) : base(logger)
        {
            RuleFor(x => x.Request)
                .NotNull()
                .WithMessage("Update profile request is required");

            When(x => x.Request != null, () =>
            {
                RuleFor(x => x.Request.FirstName)
                    .NotEmpty()
                    .WithMessage("First name is required")
                    .MaximumLength(50)
                    .WithMessage("First name cannot exceed 50 characters")
                    .Matches(@"^[a-zA-Z\s\-'\.]+$")
                    .WithMessage("First name can only contain letters, spaces, hyphens, apostrophes, and periods")
                    .Must(NotContainProfanity)
                    .WithMessage("First name contains inappropriate content");

                RuleFor(x => x.Request.LastName)
                    .NotEmpty()
                    .WithMessage("Last name is required")
                    .MaximumLength(50)
                    .WithMessage("Last name cannot exceed 50 characters")
                    .Matches(@"^[a-zA-Z\s\-'\.]+$")
                    .WithMessage("Last name can only contain letters, spaces, hyphens, apostrophes, and periods")
                    .Must(NotContainProfanity)
                    .WithMessage("Last name contains inappropriate content");

                RuleFor(x => x.Request.PhoneNumber)
                    .MustBeValidPhoneNumber()
                    .When(x => !string.IsNullOrEmpty(x.Request?.PhoneNumber));

                RuleFor(x => x.Request.Bio)
                    .MaximumLength(500)
                    .WithMessage("Bio cannot exceed 500 characters")
                    .Must(NotContainProfanity)
                    .WithMessage("Bio contains inappropriate content")
                    .Must(NotContainSpam)
                    .WithMessage("Bio contains spam content")
                    .When(x => !string.IsNullOrEmpty(x.Request?.Bio));

                RuleFor(x => x.Request.Website)
                    .MustBeValidUrl()
                    .Must(BeAllowedWebsite)
                    .WithMessage("Website URL is not allowed")
                    .When(x => !string.IsNullOrEmpty(x.Request?.Website));

                RuleFor(x => x.Request.Location)
                    .MaximumLength(100)
                    .WithMessage("Location cannot exceed 100 characters")
                    .Matches(@"^[a-zA-Z0-9\s\-,\.]+$")
                    .WithMessage("Location contains invalid characters")
                    .When(x => !string.IsNullOrEmpty(x.Request?.Location));

                RuleFor(x => x.Request.DateOfBirth)
                    .MustBeWithinAge(13, 120)
                    .WithMessage("Age must be between 13 and 120 years")
                    .When(x => x.Request?.DateOfBirth.HasValue == true);

                RuleFor(x => x.Request.Gender)
                    .IsInEnum()
                    .WithMessage("Invalid gender value")
                    .When(x => x.Request?.Gender.HasValue == true);

                RuleFor(x => x.Request.LanguagePreference)
                    .MustBeValidLanguageCode()
                    .When(x => !string.IsNullOrEmpty(x.Request?.LanguagePreference));

                RuleFor(x => x.Request.TimeZone)
                    .MustBeValidTimeZone()
                    .When(x => !string.IsNullOrEmpty(x.Request?.TimeZone));

                // Social media validations
                RuleFor(x => x.Request.TwitterHandle)
                    .Matches(@"^@?[A-Za-z0-9_]{1,15}$")
                    .WithMessage("Twitter handle must be 1-15 characters and contain only letters, numbers, and underscores")
                    .When(x => !string.IsNullOrEmpty(x.Request?.TwitterHandle));

                RuleFor(x => x.Request.LinkedInProfile)
                    .MustBeValidUrl()
                    .Must(url => url.Contains("linkedin.com"))
                    .WithMessage("Must be a valid LinkedIn profile URL")
                    .When(x => !string.IsNullOrEmpty(x.Request?.LinkedInProfile));

                RuleFor(x => x.Request.GitHubProfile)
                    .MustBeValidUrl()
                    .Must(url => url.Contains("github.com"))
                    .WithMessage("Must be a valid GitHub profile URL")
                    .When(x => !string.IsNullOrEmpty(x.Request?.GitHubProfile));

                // Privacy settings validations
                RuleFor(x => x.Request.IsProfilePublic)
                    .NotNull()
                    .WithMessage("Profile visibility setting is required");

                RuleFor(x => x.Request.ShowEmail)
                    .NotNull()
                    .WithMessage("Email visibility setting is required");

                RuleFor(x => x.Request.ShowPhoneNumber)
                    .NotNull()
                    .WithMessage("Phone number visibility setting is required");

                // Notification preferences
                RuleFor(x => x.Request.EmailNotifications)
                    .NotNull()
                    .WithMessage("Email notification preference is required");

                RuleFor(x => x.Request.PushNotifications)
                    .NotNull()
                    .WithMessage("Push notification preference is required");

                RuleFor(x => x.Request.SmsNotifications)
                    .NotNull()
                    .WithMessage("SMS notification preference is required");
            });
        }

        private void ValidatePhoneNumber(string propertyName)
        {
            RuleFor(x => GetPropertyValue(x, propertyName))
                .Matches(@"^\+?[1-9]\d{1,14}$")
                .WithMessage("Phone number format is invalid")
                .When(x => !string.IsNullOrEmpty(GetStringValue(x, propertyName)));
        }

        private static bool NotContainProfanity(string? text)
        {
            if (string.IsNullOrEmpty(text)) return true;

            var profanityWords = new[] { "badword1", "badword2", "badword3" }; // Add actual profanity list
            return !profanityWords.Any(word => text.ToLower().Contains(word.ToLower()));
        }

        private static bool NotContainSpam(string? text)
        {
            if (string.IsNullOrEmpty(text)) return true;

            var spamIndicators = new[] { "click here", "buy now", "free money", "guaranteed" };
            var spamCount = spamIndicators.Count(indicator => text.ToLower().Contains(indicator.ToLower()));
            
            return spamCount < 2; // Allow some marketing language but not obvious spam
        }

        private static bool BeAllowedWebsite(string? url)
        {
            if (string.IsNullOrEmpty(url)) return true;

            var blockedDomains = new[] { "malicious-site.com", "spam-site.com" };
            return !blockedDomains.Any(domain => url.ToLower().Contains(domain));
        }

        private static string GetStringValue(UpdateProfileCommand command, string propertyName)
        {
            var property = command.Request?.GetType().GetProperty(propertyName);
            return property?.GetValue(command.Request)?.ToString() ?? string.Empty;
        }

        private static object GetPropertyValue(UpdateProfileCommand command, string propertyName)
        {
            var property = command.Request?.GetType().GetProperty(propertyName);
            return property?.GetValue(command.Request) ?? string.Empty;
        }
    }
}