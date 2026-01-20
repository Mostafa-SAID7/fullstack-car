using Application.Features.Common.Views.Commands;
using FluentValidation;

namespace Application.Features.Common.Views.Validators;

public class UpdateViewCountCommandValidator : AbstractValidator<UpdateViewCountCommand>
{
    public UpdateViewCountCommandValidator()
    {
        RuleFor(x => x.ContentId)
            .NotEmpty()
            .WithMessage("Content ID is required.");

        RuleFor(x => x.ContentType)
            .IsInEnum()
            .WithMessage("Valid content type is required.");

        RuleFor(x => x.Increment)
            .GreaterThanOrEqualTo(-1000)
            .LessThanOrEqualTo(1000)
            .WithMessage("Increment must be between -1000 and 1000.");
    }
}