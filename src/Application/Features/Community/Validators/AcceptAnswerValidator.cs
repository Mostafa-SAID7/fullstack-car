using Application.Features.Community.Commands;
using FluentValidation;

namespace Application.Features.Community.Validators;

public class AcceptAnswerValidator : AbstractValidator<AcceptAnswerCommand>
{
    public AcceptAnswerValidator()
    {
        RuleFor(x => x.AnswerId)
            .NotEmpty()
            .WithMessage("Answer ID is required");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");
    }
}
