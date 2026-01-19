using Application.Features.Community.Commands;
using FluentValidation;

namespace Application.Features.Community.Validators;

public class CreateQuestionValidator : AbstractValidator<CreateQuestionCommand>
{
    public CreateQuestionValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.Request.Title)
            .NotEmpty()
            .WithMessage("Question title is required")
            .Length(10, 300)
            .WithMessage("Question title must be between 10 and 300 characters");

        RuleFor(x => x.Request.Content)
            .NotEmpty()
            .WithMessage("Question content is required")
            .Length(20, 10000)
            .WithMessage("Question content must be between 20 and 10,000 characters");

        RuleFor(x => x.Request.Category)
            .NotEmpty()
            .WithMessage("Category is required")
            .MaximumLength(100)
            .WithMessage("Category must not exceed 100 characters");

        RuleFor(x => x.Request.Tags)
            .Must(tags => tags.Count <= 5)
            .WithMessage("Maximum 5 tags are allowed")
            .Must(tags => tags.All(tag => !string.IsNullOrWhiteSpace(tag) && tag.Length <= 50))
            .WithMessage("Each tag must be non-empty and not exceed 50 characters");

        When(x => x.Request.IsScheduled, () =>
        {
            RuleFor(x => x.Request.ScheduledAt)
                .NotNull()
                .WithMessage("Scheduled date is required when question is scheduled")
                .GreaterThan(DateTime.UtcNow)
                .WithMessage("Scheduled date must be in the future");
        });
    }
}
