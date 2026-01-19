using Application.Features.Community.Commands;
using FluentValidation;

namespace Application.Features.Community.Validators;

public class DeleteQuestionValidator : AbstractValidator<DeleteQuestionCommand>
{
    public DeleteQuestionValidator()
    {
        RuleFor(x => x.QuestionId)
            .NotEmpty()
            .WithMessage("Question ID is required");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");
    }
}
