using Application.Features.Community.QA.Commands;
using FluentValidation;

namespace Application.Features.Community.QA.Validators;

public class DeleteAnswerValidator : AbstractValidator<DeleteAnswerCommand>
{
    public DeleteAnswerValidator()
    {
        RuleFor(x => x.AnswerId)
            .NotEmpty()
            .WithMessage("Answer ID is required");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");
    }
}