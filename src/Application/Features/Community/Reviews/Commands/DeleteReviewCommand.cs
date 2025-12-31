using Application.Common.Models;
using Domain.Entities.Community.Reviews;
using Domain.Interfaces;
using MediatR;
using Application.Features.Shared.Interfaces.Caching;

namespace Application.Features.Community.Reviews.Commands
{
    public class DeleteReviewCommand : IRequest<Result<bool>>, ICacheInvalidatorRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public bool IsAdmin { get; set; }

        public string[] CacheTags => new[] { "Reviews" };
    }

    public class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand, Result<bool>>
    {
        private readonly IRepository<Review> _reviewRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteReviewCommandHandler(IRepository<Review> reviewRepository, IUnitOfWork unitOfWork)
        {
            _reviewRepository = reviewRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(DeleteReviewCommand command, CancellationToken cancellationToken)
        {
            var review = await _reviewRepository.GetByIdAsync(command.Id, cancellationToken);

            if (review == null || review.IsDeleted)
            {
                return Result<bool>.Failure("Review not found.");
            }

            if (review.UserId != command.UserId && !command.IsAdmin)
            {
                return Result<bool>.Failure("You are not authorized to delete this review.");
            }

            review.IsDeleted = true;
            review.DeletedAt = DateTime.UtcNow;
            review.DeletedBy = command.UserId.ToString();

            await _reviewRepository.UpdateAsync(review, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
