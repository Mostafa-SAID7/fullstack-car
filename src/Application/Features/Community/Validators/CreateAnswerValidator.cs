using Application.Features.Community.Commands;
using FluentValidation;

namespace Application.Features.Community.Validators;

public class CreateAnswerValidator : AbstractValidator<CreateAnswerCommand>
{
    public CreateAnswerValidator()
    {
        RuleFor(x => x.QuestionId)
            .NotEmpty()
            .WithMessage("Question ID is required");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.Request.Content)
            .NotEmpty()
            .WithMessage("Answer content is required")
            .Length(20, 10000)
            .WithMessage("Answer content must be between 20 and 10,000 characters");
    }
}
