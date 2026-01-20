using Application.Features.Common.Bookmarks.Commands;
using FluentValidation;

namespace Application.Features.Common.Bookmarks.Validators;

public class BookmarkCommandValidator : AbstractValidator<BookmarkCommand>
{
    public BookmarkCommandValidator()
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

        RuleFor(x => x.Notes)
            .MaximumLength(500)
            .WithMessage("Notes cannot exceed 500 characters.");
    }
}