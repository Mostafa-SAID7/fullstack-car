using Application.Features.Common.Views.Commands;
using FluentValidation;

namespace Application.Features.Common.Views.Validators;

public class TrackViewCommandValidator : AbstractValidator<TrackViewCommand>
{
    public TrackViewCommandValidator()
    {
        RuleFor(x => x.ContentId)
            .NotEmpty()
            .WithMessage("Content ID is required.");

        RuleFor(x => x.ContentType)
            .IsInEnum()
            .WithMessage("Valid content type is required.");

        RuleFor(x => x.IpAddress)
            .MaximumLength(45)
            .WithMessage("IP address cannot exceed 45 characters.");

        RuleFor(x => x.UserAgent)
            .MaximumLength(500)
            .WithMessage("User agent cannot exceed 500 characters.");
    }
}