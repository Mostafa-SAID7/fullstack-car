using Application.Features.Common.Bookmarks.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Common.Bookmarks.Validators;

public class BookmarkRequestValidator : AbstractValidator<BookmarkRequest>
{
    public BookmarkRequestValidator()
    {
        RuleFor(x => x.ContentId)
            .NotEmpty()
            .WithMessage("Content ID is required.");

        RuleFor(x => x.ContentType)
            .IsInEnum()
            .WithMessage("Valid content type is required.");

        RuleFor(x => x.Notes)
            .MaximumLength(500)
            .WithMessage("Notes cannot exceed 500 characters.");
    }
}