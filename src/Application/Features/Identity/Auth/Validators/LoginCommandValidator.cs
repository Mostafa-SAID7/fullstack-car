using Application.Common.Validators;
using Application.Features.Identity.Auth.Commands;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Features.Identity.Auth.Validators
{
    public class LoginCommandValidator : BaseValidator<LoginCommand>
    {
        public LoginCommandValidator(ILogger<LoginCommandValidator> logger) : base(logger)
        {
            RuleFor(x => x.Request)
                .NotNull()
                .WithMessage("Login request is required");

            When(x => x.Request != null, () =>
            {
                RuleFor(x => x.Request.Email)
                    .NotEmpty()
                    .WithMessage("Email is required")
                    .EmailAddress()
                    .WithMessage("Email format is invalid")
                    .MaximumLength(254)
                    .WithMessage("Email cannot exceed 254 characters")
                    .Must(BeValidEmailDomain)
                    .WithMessage("Email domain is not allowed");

                RuleFor(x => x.Request.Password)
                    .NotEmpty()
                    .WithMessage("Password is required")
                    .MinimumLength(1) // Don't validate password strength on login
                    .WithMessage("Password is required");

                RuleFor(x => x.Request.RememberMe)
                    .NotNull()
                    .WithMessage("RememberMe flag is required");

                // Additional security validations
                RuleFor(x => x.Request.Email)
                    .Must(NotBeCommonAttackEmail)
                    .WithMessage("Invalid email address")
                    .When(x => !string.IsNullOrEmpty(x.Request?.Email));
            });
        }

        private static bool BeValidEmailDomain(string email)
        {
            if (string.IsNullOrEmpty(email)) return true;

            var blockedDomains = new[] { "tempmail.com", "10minutemail.com", "guerrillamail.com" };
            var domain = email.Split('@').LastOrDefault()?.ToLower();
            
            return domain != null && !blockedDomains.Contains(domain);
        }

        private static bool NotBeCommonAttackEmail(string email)
        {
            if (string.IsNullOrEmpty(email)) return true;

            var commonAttackEmails = new[] { "admin@admin.com", "test@test.com", "root@root.com" };
            return !commonAttackEmails.Contains(email.ToLower());
        }
    }
}