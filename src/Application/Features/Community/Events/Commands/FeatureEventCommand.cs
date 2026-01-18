using Application.Common.DTOs;
using Application.Features.Community.Events.Interfaces;
using MediatR;

namespace Application.Features.Community.Events.Commands
{
    public class FeatureEventCommand : IRequest<Result<bool>>
    {
        public Guid EventId { get; set; }
        public Guid UserId { get; set; }
        public bool IsFeatured { get; set; }
    }

    public class FeatureEventCommandHandler : IRequestHandler<FeatureEventCommand, Result<bool>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IUnitOfWork _unitOfWork;

        public FeatureEventCommandHandler(
            IEventRepository eventRepository,
            IUnitOfWork unitOfWork)
        {
            _eventRepository = eventRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(FeatureEventCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate event exists
                var eventEntity = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);
                if (eventEntity == null)
                {
                    return Result<bool>.Failure("Event not found");
                }

                // Check if event is active
                if (!eventEntity.IsActive)
                {
                    return Result<bool>.Failure("Cannot feature inactive events");
                }

                // Check if event is public
                if (!eventEntity.IsPublic)
                {
                    return Result<bool>.Failure("Cannot feature private events");
                }

                // Update featured status
                bool success;
                if (request.IsFeatured)
                {
                    success = await _eventRepository.FeatureEventAsync(request.EventId, cancellationToken);
                }
                else
                {
                    success = await _eventRepository.UnfeatureEventAsync(request.EventId, cancellationToken);
                }

                if (success)
                {
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    return Result<bool>.Success(true);
                }

                return Result<bool>.Failure("Failed to update event featured status");
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to update featured status: {ex.Message}");
            }
        }
    }
}