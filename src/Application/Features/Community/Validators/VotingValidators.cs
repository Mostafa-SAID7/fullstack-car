using Application.Features.Community.Commands;
using Application.Features.Community.DTOs.Requests;
using Domain.Enums.Common;
using Domain.Enums.Community;
using FluentValidation;

namespace Application.Features.Community.Validators;

public class CreateVoteCommandValidator : AbstractValidator<CreateVoteCommand>
{
    public CreateVoteCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.Request)
            .NotNull()
            .WithMessage("Vote request is required.")
            .SetValidator(new CreateVoteRequestValidator());
    }
}

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
            .Must(x => x == Domain.Enums.Community.VoteType.Upvote || x == Domain.Enums.Community.VoteType.Downvote)
            .WithMessage("Vote type must be 'Up' or 'Down'.");
    }
}

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

public class ChangeVoteCommandValidator : AbstractValidator<ChangeVoteCommand>
{
    public ChangeVoteCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");

        RuleFor(x => x.Request)
            .NotNull()
            .WithMessage("Change vote request is required.")
            .SetValidator(new ChangeVoteRequestValidator());
    }
}

public class ChangeVoteRequestValidator : AbstractValidator<ChangeVoteRequest>
{
    public ChangeVoteRequestValidator()
    {
        RuleFor(x => x.ContentId)
            .NotEmpty()
            .WithMessage("Content ID is required.");

        RuleFor(x => x.ContentType)
            .NotEmpty()
            .WithMessage("Content type is required.")
            .Must(x => x == ContentType.Question || x == ContentType.Answer)
            .WithMessage("Content type must be 'Question' or 'Answer'.");

        RuleFor(x => x.NewVoteType)
            .NotEmpty()
            .WithMessage("New vote type is required.")
            .Must(x => x == Domain.Enums.Community.VoteType.Upvote || x == Domain.Enums.Community.VoteType.Downvote)
            .WithMessage("New vote type must be 'Up' or 'Down'.");
    }
}
