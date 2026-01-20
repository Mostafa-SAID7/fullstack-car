using Application.Features.Common.Votes.Commands;
using Application.Features.Common.Votes.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Common.Votes.Validators;

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