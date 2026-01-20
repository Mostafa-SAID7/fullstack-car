using Application.Features.Common.Bookmarks.Commands;
using FluentValidation;

namespace Application.Features.Common.Bookmarks.Validators;

public class RemoveBookmarkCommandValidator : AbstractValidator<RemoveBookmarkCommand>
{
    public RemoveBookmarkCommandValidator()
    {
        RuleFor(x => x.ContentId)
            .NotEmpty()
            .WithMessage("Content ID is required.");

        RuleFor(x => x.ContentType)
            .IsInEnum()
            .WithMessage("Valid content type is required.");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required.");
    }
}