using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Domain.Entities.Community.Reviews;
using Domain.Interfaces;
using MediatR;
using Application.Features.Shared.Caching.Interfaces.Services;

namespace Application.Features.Community.Reviews.Commands
{
    public class FlagReviewCommand : IRequest<Result<bool>>, ICacheInvalidatorRequest
    {
        public Guid Id { get; set; }
        public FlagReviewRequest Request { get; set; } = null!;

        public string[]? CacheKeysToInvalidate => null;
        public string[]? CacheTagsToInvalidate => new[] { "Reviews" };
    }

    public class FlagReviewCommandHandler : IRequestHandler<FlagReviewCommand, Result<bool>>
    {
        private readonly IRepository<Review> _reviewRepository;
        private readonly IUnitOfWork _unitOfWork;

        public FlagReviewCommandHandler(IRepository<Review> reviewRepository, IUnitOfWork unitOfWork)
        {
            _reviewRepository = reviewRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(FlagReviewCommand command, CancellationToken cancellationToken)
        {
            var review = await _reviewRepository.GetByIdAsync(command.Id, cancellationToken);

            if (review == null || review.IsDeleted)
            {
                return Result<bool>.Failure("Review not found.");
            }

            review.IsFlagged = true;
            review.FlagReason = command.Request.Reason;

            await _reviewRepository.UpdateAsync(review, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
