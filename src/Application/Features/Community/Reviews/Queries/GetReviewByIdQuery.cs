using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Domain.Entities.Community.Reviews;
using Domain.Interfaces;
using Application.Common.Specifications.Community.Reviews;
using MediatR;
using Application.Features.Shared.Caching.Interfaces.Services;

namespace Application.Features.Community.Reviews.Queries
{
    public class GetReviewByIdQuery : IRequest<Result<ReviewDto>>, ICacheableRequest
    {
        public Guid Id { get; set; }

        public string CacheKey => $"Review_{Id}";
        public TimeSpan? CacheExpiration => TimeSpan.FromMinutes(10);
        public string[]? CacheTags => new[] { "Reviews" };
    }

    public class GetReviewByIdQueryHandler : IRequestHandler<GetReviewByIdQuery, Result<ReviewDto>>
    {
        private readonly IRepository<Review> _reviewRepository;

        public GetReviewByIdQueryHandler(IRepository<Review> reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<Result<ReviewDto>> Handle(GetReviewByIdQuery request, CancellationToken cancellationToken)
        {
            var specification = new ReviewByIdSpecification(request.Id);
            var review = await _reviewRepository.FirstOrDefaultAsync(specification.Criteria!, cancellationToken);

            if (review == null)
            {
                return Result<ReviewDto>.Failure("Review not found.");
            }

            var reviewDto = new ReviewDto
            {
                Id = review.Id,
                Title = review.Title,
                Content = review.Content,
                Rating = review.Rating,
                Type = review.Type,
                ImageUrl = review.ImageUrl,
                IsVerified = review.IsVerified,
                HelpfulCount = review.HelpfulCount,
                CreatedAt = review.CreatedAt,
                UpdatedAt = review.UpdatedAt,
                UserId = review.UserId,
                UserFirstName = review.User.FirstName,
                UserLastName = review.User.LastName,
                UserProfileImageUrl = review.User.ProfileImageUrl,
                CarBrand = review.CarBrand,
                CarModel = review.CarModel,
                CarYear = review.CarYear
            };

            return Result<ReviewDto>.Success(reviewDto);
        }
    }
}
