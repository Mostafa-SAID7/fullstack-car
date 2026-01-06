using Application.Features.Community.Guides.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Community.Guides.Validators;

public class CreateGuideRequestValidator : AbstractValidator<CreateGuideRequest>
{
    public CreateGuideRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required")
            .MinimumLength(100).WithMessage("Content must be at least 100 characters");

        RuleFor(x => x.Summary)
            .NotEmpty().WithMessage("Summary is required")
            .MaximumLength(500).WithMessage("Summary cannot exceed 500 characters");

        RuleFor(x => x.Category)
            .IsInEnum().WithMessage("Invalid category");

        RuleFor(x => x.Difficulty)
            .IsInEnum().WithMessage("Invalid difficulty level");

        RuleFor(x => x.EstimatedReadTime)
            .GreaterThan(0).WithMessage("Estimated read time must be greater than 0");

        RuleFor(x => x.Steps)
            .NotEmpty().WithMessage("At least one step is required")
            .Must(steps => steps.Select(s => s.StepNumber).Distinct().Count() == steps.Count)
            .WithMessage("Step numbers must be unique");

        RuleForEach(x => x.Steps).SetValidator(new CreateGuideStepRequestValidator());
    }
}

public class CreateGuideStepRequestValidator : AbstractValidator<CreateGuideStepRequest>
{
    public CreateGuideStepRequestValidator()
    {
        RuleFor(x => x.StepNumber)
            .GreaterThan(0).WithMessage("Step number must be greater than 0");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Step title is required")
            .MaximumLength(200).WithMessage("Step title cannot exceed 200 characters");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Step content is required");

        RuleFor(x => x.EstimatedTime)
            .GreaterThanOrEqualTo(0).WithMessage("Estimated time cannot be negative");

        RuleFor(x => x.ImageUrl)
            .Must(BeAValidUrl).When(x => !string.IsNullOrEmpty(x.ImageUrl))
            .WithMessage("Invalid image URL");

        RuleFor(x => x.VideoUrl)
            .Must(BeAValidUrl).When(x => !string.IsNullOrEmpty(x.VideoUrl))
            .WithMessage("Invalid video URL");
    }

    private static bool BeAValidUrl(string? url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out _);
    }
}
