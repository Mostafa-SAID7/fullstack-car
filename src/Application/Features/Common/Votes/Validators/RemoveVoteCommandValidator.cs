using Application.Features.Common.Votes.Commands;
using Domain.Enums.Common;
using FluentValidation;

namespace Application.Features.Common.Votes.Validators;

public class RemoveVoteCommandValidator : AbstractValidator<RemoveVoteCommand>
{
    public RemoveVoteCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.ContentId)
            .NotEmpty()
            .WithMessage("Content ID is required.");

        RuleFor(x => x.ContentType)
            .NotEmpty()
            .WithMessage("Content type is required.")
            .Must(x => x == ContentType.Question || x == ContentType.Answer)
            .WithMessage("Content type must be 'Question' or 'Answer'.");
    }
}