using Application.Common.Models;
using Domain.Entities.Community.Reviews;
using Domain.Interfaces;
using MediatR;
using Application.Common.Interfaces.Caching;

namespace Application.Features.Community.Reviews.Commands
{
    public class MarkReviewHelpfulCommand : IRequest<Result<bool>>, ICacheInvalidatorRequest
    {
        public Guid Id { get; set; }
        public string[] CacheTags => new[] { "Reviews" };
    }

    public class MarkReviewHelpfulCommandHandler : IRequestHandler<MarkReviewHelpfulCommand, Result<bool>>
    {
        private readonly IRepository<Review> _reviewRepository;
        private readonly IUnitOfWork _unitOfWork;

        public MarkReviewHelpfulCommandHandler(IRepository<Review> reviewRepository, IUnitOfWork unitOfWork)
        {
            _reviewRepository = reviewRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(MarkReviewHelpfulCommand command, CancellationToken cancellationToken)
        {
            var review = await _reviewRepository.GetByIdAsync(command.Id, cancellationToken);

            if (review == null || review.IsDeleted)
            {
                return Result<bool>.Failure("Review not found.");
            }

            review.HelpfulCount++;

            await _reviewRepository.UpdateAsync(review, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<bool>.Success(true);
        }
    }
}
