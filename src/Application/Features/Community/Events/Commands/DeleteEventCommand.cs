using Application.Common.DTOs;
using Application.Features.Community.Events.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Application.Features.Shared.Caching.Interfaces.Services;
using MediatR;

namespace Application.Features.Community.Events.Commands
{
    public class DeleteEventCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? Reason { get; set; }
    }

    public class DeleteEventCommandHandler : IRequestHandler<DeleteEventCommand, Result<bool>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly INotificationService _notificationService;
        private readonly ICacheService _cacheService;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteEventCommandHandler(
            IEventRepository eventRepository,
            INotificationService notificationService,
            ICacheService cacheService,
            IUnitOfWork unitOfWork)
        {
            _eventRepository = eventRepository;
            _notificationService = notificationService;
            _cacheService = cacheService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<bool>> Handle(DeleteEventCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Get existing event
                var eventEntity = await _eventRepository.GetByIdWithDetailsAsync(request.Id, cancellationToken);
                if (eventEntity == null)
                {
                    return Result<bool>.Failure("Event not found");
                }

                // Check permissions
                if (!await _eventRepository.CanUserEditEventAsync(request.Id, request.UserId, cancellationToken))
                {
                    return Result<bool>.Failure("You don't have permission to delete this event");
                }

                // Check if event has started
                if (eventEntity.StartDate <= DateTime.UtcNow)
                {
                    // Cancel instead of delete if event has started
                    await _eventRepository.CancelEventAsync(request.Id, request.Reason ?? "Event cancelled by organizer", cancellationToken);
                    
                    // Send cancellation notifications
                    await _notificationService.NotifyEventCancelledAsync(
                        Guid.Empty, // No specific group
                        eventEntity.Id,
                        eventEntity.Title);
                }
                else
                {
                    // Delete if event hasn't started
                    await _eventRepository.DeleteAsync(eventEntity, cancellationToken);
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Invalidate cache
                await _cacheService.RemoveByTagAsync("Events", cancellationToken);
                await _cacheService.RemoveByTagAsync("Featured", cancellationToken);
                await _cacheService.RemoveByTagAsync("Trending", cancellationToken);
                await _cacheService.RemoveByTagAsync("Upcoming", cancellationToken);
                await _cacheService.RemoveByTagAsync("Categories", cancellationToken);
                await _cacheService.RemoveByTagAsync("Stats", cancellationToken);
                await _cacheService.RemoveByTagAsync("MyEvents", cancellationToken);
                await _cacheService.RemoveByTagAsync($"Event_{request.Id}", cancellationToken);

                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Failed to delete event: {ex.Message}");
            }
        }
    }
}