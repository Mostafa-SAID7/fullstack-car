using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Domain.Entities.Community.Reviews;
using Domain.Interfaces;
using MediatR;
using Application.Features.Shared.Caching.Interfaces.Services;

namespace Application.Features.Community.Reviews.Commands
{
    public class CreateReviewCommand : IRequest<Result<Guid>>, ICacheInvalidatorRequest
    {
        public CreateReviewRequest Request { get; set; } = null!;
        public Guid UserId { get; set; }

        public string[]? CacheKeysToInvalidate => null;
        public string[]? CacheTagsToInvalidate => new[] { "Reviews" };
    }

    public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, Result<Guid>>
    {
        private readonly IRepository<Review> _reviewRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CreateReviewCommandHandler(IRepository<Review> reviewRepository, IUnitOfWork unitOfWork)
        {
            _reviewRepository = reviewRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<Guid>> Handle(CreateReviewCommand command, CancellationToken cancellationToken)
        {
            var review = new Review
            {
                Title = command.Request.Title,
                Content = command.Request.Content,
                Rating = command.Request.Rating,
                Type = command.Request.Type,
                ImageUrl = command.Request.ImageUrl,
                UserId = command.UserId,
                CarBrand = command.Request.CarBrand,
                CarModel = command.Request.CarModel,
                CarYear = command.Request.CarYear,
                IsVerified = false,
                HelpfulCount = 0
            };

            await _reviewRepository.AddAsync(review, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<Guid>.Success(review.Id);
        }
    }
}
