using Application.Features.Media.Videos.DTOs.Requests;
using FluentValidation;

namespace Application.Features.Media.Videos.Validators;

public class CreateVideoRequestValidator : AbstractValidator<CreateVideoRequest>
{
    public CreateVideoRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters");

        RuleFor(x => x.Tags)
            .MaximumLength(1000).WithMessage("Tags must not exceed 1000 characters");

        RuleFor(x => x.Thumbnail)
            .MaximumLength(500).WithMessage("Thumbnail URL must not exceed 500 characters");
    }
}

public class UpdateVideoRequestValidator : AbstractValidator<UpdateVideoRequest>
{
    public UpdateVideoRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters");

        RuleFor(x => x.Tags)
            .MaximumLength(1000).WithMessage("Tags must not exceed 1000 characters");

        RuleFor(x => x.Thumbnail)
            .MaximumLength(500).WithMessage("Thumbnail URL must not exceed 500 characters");
    }
}
