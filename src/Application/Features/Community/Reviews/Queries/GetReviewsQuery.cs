using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Domain.Entities.Community.Reviews;
using Domain.Interfaces;
using Application.Common.Specifications.Community.Reviews;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Reviews.Queries
{
    public class GetReviewsQuery : IRequest<Result<PaginatedList<ReviewDto>>>, ICacheableRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? CarBrand { get; set; }
        public string? CarModel { get; set; }
        public Guid? UserId { get; set; }
        public string? SortBy { get; set; } = "CreatedAt";
        public bool SortDescending { get; set; } = true;
        public int? MinRating { get; set; }
        public int? MaxRating { get; set; }

        public string CacheKey => $"Reviews_{CarBrand}_{CarModel}_{UserId}_{PageNumber}_{PageSize}_{SortBy}_{SortDescending}_{MinRating}_{MaxRating}";
        public TimeSpan? CacheExpiration => TimeSpan.FromMinutes(10);
        public string[]? CacheTags => new[] { "Reviews" };
    }

    public class GetReviewsQueryHandler : IRequestHandler<GetReviewsQuery, Result<PaginatedList<ReviewDto>>>
    {
        private readonly IRepository<Review> _reviewRepository;

        public GetReviewsQueryHandler(IRepository<Review> reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<Result<PaginatedList<ReviewDto>>> Handle(GetReviewsQuery request, CancellationToken cancellationToken)
        {
            var skip = (request.PageNumber - 1) * request.PageSize;
            var specification = new ReviewsWithDetailsSpecification(skip, request.PageSize, request.CarBrand, request.CarModel, request.UserId);
            
            var reviews = await _reviewRepository.ListAsync(specification.Criteria!, cancellationToken);
            var totalCount = await _reviewRepository.CountAsync(specification.Criteria!, cancellationToken);

            var reviewDtos = reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                Title = r.Title,
                Content = r.Content,
                Rating = r.Rating,
                Type = r.Type,
                ImageUrl = r.ImageUrl,
                IsVerified = r.IsVerified,
                HelpfulCount = r.HelpfulCount,
                CreatedAt = r.CreatedAt,
                UpdatedAt = r.UpdatedAt,
                UserId = r.UserId,
                UserFirstName = r.User.FirstName,
                UserLastName = r.User.LastName,
                UserProfileImageUrl = r.User.ProfileImageUrl,
                CarBrand = r.CarBrand,
                CarModel = r.CarModel,
                CarYear = r.CarYear
            }).ToList();

            var paginatedList = new PaginatedList<ReviewDto>(reviewDtos, totalCount, request.PageNumber, request.PageSize);
            return Result<PaginatedList<ReviewDto>>.Success(paginatedList);
        }
    }
}
