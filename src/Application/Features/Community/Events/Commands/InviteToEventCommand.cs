using Application.Common.DTOs;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Interfaces;
using Application.Features.Shared.Notifications.Interfaces;
using Domain.Entities.Community.Events;
using MediatR;

namespace Application.Features.Community.Events.Commands
{
    public class InviteToEventCommand : IRequest<Result<List<EventInvitationDto>>>
    {
        public Guid EventId { get; set; }
        public Guid InvitedBy { get; set; }
        public InviteToEventRequest Request { get; set; } = new();
    }

    public class InviteToEventCommandHandler : IRequestHandler<InviteToEventCommand, Result<List<EventInvitationDto>>>
    {
        private readonly IEventRepository _eventRepository;
        private readonly IEventInvitationRepository _invitationRepository;
        private readonly INotificationService _notificationService;
        private readonly IUnitOfWork _unitOfWork;

        public InviteToEventCommandHandler(
            IEventRepository eventRepository,
            IEventInvitationRepository invitationRepository,
            INotificationService notificationService,
            IUnitOfWork unitOfWork)
        {
            _eventRepository = eventRepository;
            _invitationRepository = invitationRepository;
            _notificationService = notificationService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Result<List<EventInvitationDto>>> Handle(InviteToEventCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate event exists
                var eventEntity = await _eventRepository.GetByIdWithDetailsAsync(request.EventId, cancellationToken);
                if (eventEntity == null)
                {
                    return Result<List<EventInvitationDto>>.Failure("Event not found");
                }

                // Check permissions (organizer or public event)
                var canInvite = await _eventRepository.IsUserOrganizerAsync(request.EventId, request.InvitedBy, cancellationToken) ||
                              eventEntity.IsPublic;

                if (!canInvite)
                {
                    return Result<List<EventInvitationDto>>.Failure("You don't have permission to invite people to this event");
                }

                var invitations = new List<EventInvitation>();
                var invitationDtos = new List<EventInvitationDto>();

                foreach (var email in request.Request.Emails)
                {
                    // Check if already invited
                    var existingInvitation = await _invitationRepository.GetByEventAndEmailAsync(request.EventId, email, cancellationToken);
                    if (existingInvitation != null && existingInvitation.Status == "Pending")
                    {
                        continue; // Skip already invited emails
                    }

                    // Create invitation
                    var invitation = new EventInvitation
                    {
                        Id = Guid.NewGuid(),
                        EventId = request.EventId,
                        Email = email,
                        Message = request.Request.Message,
                        Status = "Pending",
                        InvitedAt = DateTime.UtcNow,
                        ExpiresAt = DateTime.UtcNow.AddDays(7), // 7 days to respond
                        InvitedBy = request.InvitedBy
                    };

                    await _invitationRepository.AddAsync(invitation, cancellationToken);
                    invitations.Add(invitation);

                    // Map to DTO
                    var invitationDto = new EventInvitationDto
                    {
                        Id = invitation.Id,
                        EventId = invitation.EventId,
                        EventTitle = eventEntity.Title,
                        Email = invitation.Email,
                        Message = invitation.Message,
                        Status = invitation.Status,
                        InvitedAt = invitation.InvitedAt,
                        ExpiresAt = invitation.ExpiresAt,
                        InvitedBy = new EventUserDto
                        {
                            Id = request.InvitedBy,
                            Username = "Unknown", // TODO: Get inviter details
                            DisplayName = "Unknown"
                        }
                    };

                    invitationDtos.Add(invitationDto);
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Send notification emails
                foreach (var invitation in invitations)
                {
                    // TODO: Send email invitation
                    // await _emailService.SendEventInvitationAsync(invitation.Email, eventEntity, invitation.Message);
                }

                return Result<List<EventInvitationDto>>.Success(invitationDtos);
            }
            catch (Exception ex)
            {
                return Result<List<EventInvitationDto>>.Failure($"Failed to send invitations: {ex.Message}");
            }
        }
    }
}