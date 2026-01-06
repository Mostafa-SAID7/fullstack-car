using Application.Features.Media.Podcasts.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Media.Podcasts.Validators;

public class CreatePodcastRequestValidator : AbstractValidator<CreatePodcastRequest>
{
    public CreatePodcastRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters");

        RuleFor(x => x.Tags)
            .MaximumLength(1000).WithMessage("Tags must not exceed 1000 characters");

        RuleFor(x => x.CoverImage)
            .MaximumLength(500).WithMessage("Cover image URL must not exceed 500 characters");

        RuleFor(x => x.Transcript)
            .MaximumLength(10000).WithMessage("Transcript must not exceed 10000 characters");

        RuleFor(x => x.EpisodeNumber)
            .GreaterThan(0).WithMessage("Episode number must be greater than 0");

        RuleFor(x => x.SeasonNumber)
            .GreaterThan(0).WithMessage("Season number must be greater than 0");
    }
}

public class CreatePodcastSeriesRequestValidator : AbstractValidator<CreatePodcastSeriesRequest>
{
    public CreatePodcastSeriesRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters");

        RuleFor(x => x.CoverImage)
            .MaximumLength(500).WithMessage("Cover image URL must not exceed 500 characters");

        RuleFor(x => x.Category)
            .MaximumLength(100).WithMessage("Category must not exceed 100 characters");

        RuleFor(x => x.Language)
            .NotEmpty().WithMessage("Language is required")
            .MaximumLength(10).WithMessage("Language must not exceed 10 characters");
    }
}
