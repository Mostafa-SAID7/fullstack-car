using Application.Features.Common.Votes.DTOs.Requests;
using Domain.Enums.Common;
using FluentValidation;

namespace Application.Features.Common.Votes.Validators;

public class CreateVoteRequestValidator : AbstractValidator<CreateVoteRequest>
{
    public CreateVoteRequestValidator()
    {
        RuleFor(x => x.ContentId)
            .NotEmpty()
            .WithMessage("Content ID is required.");

        RuleFor(x => x.ContentType)
            .NotEmpty()
            .WithMessage("Content type is required.")
            .Must(x => x == ContentType.Question || x == ContentType.Answer)
            .WithMessage("Content type must be 'Question' or 'Answer'.");

        RuleFor(x => x.VoteType)
            .NotEmpty()
            .WithMessage("Vote type is required.")
            .Must(x => x == Domain.Enums.Common.VoteType.Up || x == Domain.Enums.Common.VoteType.Down)
            .WithMessage("Vote type must be 'Up' or 'Down'.");
    }
}