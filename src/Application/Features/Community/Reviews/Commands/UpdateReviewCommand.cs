using Application.Common.Models;
using Application.Features.Community.Reviews.DTOs;
using Domain.Entities.Community.Reviews;
using Domain.Interfaces;
using MediatR;
using Application.Common.Interfaces.Caching;

namespace Application.Features.Community.Reviews.Commands
{
    public class UpdateReviewCommand : IRequest<Result<bool>>, ICacheInvalidatorRequest
    {
        public Guid Id { get; set; }
        public UpdateReviewRequest Request { get; set; } = null!;
        public Guid UserId { get; set; }

        public string[] CacheTags => new[] { "Reviews" };
    }

    public class UpdateReviewCommandHandler : IRequestHandler<UpdateReviewCommand, Result<bool>>
    {
        private readonly IRepository<Review> _reviewRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateReviewCommandHandler(IRepository<Review> reviewRepository, IUnitOfWork unitOfWork)
        {
            _reviewRepository = reviewRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(UpdateReviewCommand command, CancellationToken cancellationToken)
        {
            var review = await _reviewRepository.GetByIdAsync(command.Id, cancellationToken);

            if (review == null || review.IsDeleted)
            {
                return Result<bool>.Failure("Review not found.");
            }

            if (review.UserId != command.UserId)
            {
                return Result<bool>.Failure("You are not authorized to update this review.");
            }

            review.Title = command.Request.Title;
            review.Content = command.Request.Content;
            review.Rating = command.Request.Rating;
            review.ImageUrl = command.Request.ImageUrl;

            await _reviewRepository.UpdateAsync(review, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
