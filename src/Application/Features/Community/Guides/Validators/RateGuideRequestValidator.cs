using Application.Features.Community.Guides.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Community.Guides.Validators;

public class RateGuideRequestValidator : AbstractValidator<RateGuideRequest>
{
    public RateGuideRequestValidator()
    {
        RuleFor(x => x.GuideId)
            .GreaterThan(0).WithMessage("Guide ID must be greater than 0");

        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5");

        RuleFor(x => x.Comment)
            .MaximumLength(1000).WithMessage("Comment cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Comment));
    }
}