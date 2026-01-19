using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Domain.Entities.Community.Reviews;
using Domain.Interfaces;
using MediatR;

namespace Application.Features.Community.Reviews.Queries;

public class GetReviewAnalyticsQuery : IRequest<Result<ReviewAnalyticsDto>>
{
    public Guid ReviewId { get; set; }
}

public class GetReviewAnalyticsQueryHandler : IRequestHandler<GetReviewAnalyticsQuery, Result<ReviewAnalyticsDto>>
{
    private readonly IRepository<Review> _reviewRepository;
    private readonly IRepository<ReviewHelpfulness> _helpfulnessRepository;

    public GetReviewAnalyticsQueryHandler(
        IRepository<Review> reviewRepository,
        IRepository<ReviewHelpfulness> helpfulnessRepository)
    {
        _reviewRepository = reviewRepository;
        _helpfulnessRepository = helpfulnessRepository;
    }

    public async Task<Result<ReviewAnalyticsDto>> Handle(GetReviewAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var review = await _reviewRepository.GetByIdAsync(request.ReviewId, cancellationToken);
        if (review == null)
            return Result<ReviewAnalyticsDto>.Failure("Review not found");

        // Get helpfulness data
        var helpfulnessMarks = await _helpfulnessRepository.ListAsync(
            h => h.ReviewId == request.ReviewId, 
            cancellationToken);

        var helpfulCount = helpfulnessMarks.Count(h => h.IsHelpful);
        var unhelpfulCount = helpfulnessMarks.Count(h => !h.IsHelpful);
        var totalMarks = helpfulnessMarks.Count();

        var dto = new ReviewAnalyticsDto
        {
            ReviewId = review.Id,
            TotalViews = 0, // Review entity doesn't track views - would need separate tracking
            HelpfulMarks = helpfulCount,
            UnhelpfulMarks = unhelpfulCount,
            HelpfulnessRatio = totalMarks > 0 ? (double)helpfulCount / totalMarks * 100 : 0,
            CommentsCount = 0 // Review entity doesn't track comments - would need separate entity
        };

        // Mock trend data for now (would need actual tracking tables for real implementation)
        var today = DateTime.UtcNow.Date;
        dto.ViewsByDate = new Dictionary<string, int>
        {
            { today.AddDays(-6).ToString("yyyy-MM-dd"), 0 },
            { today.AddDays(-5).ToString("yyyy-MM-dd"), 0 },
            { today.AddDays(-4).ToString("yyyy-MM-dd"), 0 },
            { today.AddDays(-3).ToString("yyyy-MM-dd"), 0 },
            { today.AddDays(-2).ToString("yyyy-MM-dd"), 0 },
            { today.AddDays(-1).ToString("yyyy-MM-dd"), 0 },
            { today.ToString("yyyy-MM-dd"), 0 }
        };

        dto.HelpfulMarksByDate = new Dictionary<string, int>
        {
            { today.AddDays(-6).ToString("yyyy-MM-dd"), helpfulCount / 7 },
            { today.ToString("yyyy-MM-dd"), helpfulCount }
        };

        return Result<ReviewAnalyticsDto>.Success(dto);
    }
}
