using Application.Features.Community.Commands;
using FluentValidation;

namespace Application.Features.Community.Validators;

public class CloseQuestionValidator : AbstractValidator<CloseQuestionCommand>
{
    public CloseQuestionValidator()
    {
        RuleFor(x => x.QuestionId)
            .NotEmpty()
            .WithMessage("Question ID is required");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.Reason)
            .NotEmpty()
            .WithMessage("Close reason is required")
            .MaximumLength(200)
            .WithMessage("Close reason must not exceed 200 characters");
    }
}
