using Application.Features.Common.Votes.Commands;
using Application.Features.Common.Votes.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Common.Votes.Validators;

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