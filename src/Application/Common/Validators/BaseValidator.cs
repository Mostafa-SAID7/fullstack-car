using FluentValidation;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;

namespace Application.Common.Validators
{
    public abstract class BaseValidator<T> : AbstractValidator<T>
    {
        protected readonly ILogger<BaseValidator<T>> _logger;

        protected BaseValidator(ILogger<BaseValidator<T>> logger)
        {
            _logger = logger;
        }

        public override FluentValidation.Results.ValidationResult Validate(ValidationContext<T> context)
        {
            var result = base.Validate(context);
            
            if (!result.IsValid)
            {
                LogValidationErrors(context.InstanceToValidate, result.Errors);
            }

            return result;
        }

        protected virtual void LogValidationErrors(T instance, IList<ValidationFailure> errors)
        {
            foreach (var error in errors)
            {
                _logger.LogWarning("Validation failed for {ValidatorType}.{PropertyName}: {ErrorMessage}. Value: {AttemptedValue}",
                    GetType().Name, error.PropertyName, error.ErrorMessage, error.AttemptedValue);
            }
        }

        // Common validation rules
        protected void ValidateId<TProperty>(System.Linq.Expressions.Expression<Func<T, TProperty>> expression)
        {
            RuleFor(expression)
                .NotEmpty()
                .WithMessage("Id is required")
                .Must(value => BeValidGuid(value))
                .WithMessage("Id must be a valid GUID");
        }

        protected void ValidateEmail(System.Linq.Expressions.Expression<Func<T, string>> expression)
        {
            RuleFor(expression)
                .NotEmpty()
                .WithMessage("Email is required")
                .EmailAddress()
                .WithMessage("Email format is invalid")
                .MaximumLength(254)
                .WithMessage("Email cannot exceed 254 characters");
        }

        protected void ValidatePassword(System.Linq.Expressions.Expression<Func<T, string>> expression)
        {
            RuleFor(expression)
                .NotEmpty()
                .WithMessage("Password is required")
                .MinimumLength(8)
                .WithMessage("Password must be at least 8 characters long")
                .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]")
                .WithMessage("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
        }

        protected void ValidatePhoneNumber(System.Linq.Expressions.Expression<Func<T, string?>> expression)
        {
            RuleFor(expression)
                .Matches(@"^\+?[1-9]\d{1,14}$")
                .WithMessage("Phone number format is invalid")
                .When(x => !string.IsNullOrEmpty(expression.Compile()(x)));
        }

        protected void ValidateUrl(System.Linq.Expressions.Expression<Func<T, string?>> expression)
        {
            RuleFor(expression)
                .Must(BeValidUrl)
                .WithMessage("URL format is invalid")
                .When(x => !string.IsNullOrEmpty(expression.Compile()(x)));
        }

        protected void ValidateEnum<TEnum>(System.Linq.Expressions.Expression<Func<T, TEnum>> expression) where TEnum : struct, Enum
        {
            RuleFor(expression)
                .IsInEnum()
                .WithMessage($"Value must be a valid {typeof(TEnum).Name}");
        }

        protected void ValidateFileSize(System.Linq.Expressions.Expression<Func<T, long>> expression, long maxSizeInBytes)
        {
            RuleFor(expression)
                .LessThanOrEqualTo(maxSizeInBytes)
                .WithMessage($"File size cannot exceed {maxSizeInBytes / (1024 * 1024)} MB");
        }

        protected void ValidateFileExtension(System.Linq.Expressions.Expression<Func<T, string?>> expression, params string[] allowedExtensions)
        {
            RuleFor(expression)
                .Must(fileName => allowedExtensions.Any(ext => 
                    !string.IsNullOrEmpty(fileName) && fileName.EndsWith(ext, StringComparison.OrdinalIgnoreCase)))
                .WithMessage($"File must have one of the following extensions: {string.Join(", ", allowedExtensions)}")
                .When(x => !string.IsNullOrEmpty(expression.Compile()(x)));
        }

        // Helper methods
        private static bool BeValidGuid(object? value)
        {
            if (value == null) return false;
            return Guid.TryParse(value.ToString(), out _);
        }

        private static bool BeValidUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return true;
            return Uri.TryCreate(url, UriKind.Absolute, out var result) &&
                   (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
        }
    }
}