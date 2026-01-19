using Application.Common.DTOs;
using Application.Common.Models;
using Application.Features.Community.Events.Commands;
using Application.Features.Community.Events.DTOs;
using Application.Features.Community.Events.Queries;
using MediatR;

namespace Application.Features.Community.Events.Services
{
    public class EventService : IEventService
    {
        private readonly IMediator _mediator;

        public EventService(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Event Management
        public async Task<Result<EventDto>> CreateEventAsync(Guid organizerId, CreateEventRequest request, CancellationToken cancellationToken = default)
        {
            var command = new CreateEventCommand
            {
                OrganizerId = organizerId,
                Request = request
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<EventDto>> UpdateEventAsync(Guid eventId, Guid userId, UpdateEventRequest request, CancellationToken cancellationToken = default)
        {
            var command = new UpdateEventCommand
            {
                Id = eventId,
                UserId = userId,
                Request = request
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<bool>> DeleteEventAsync(Guid eventId, Guid userId, string? reason = null, CancellationToken cancellationToken = default)
        {
            var command = new DeleteEventCommand
            {
                Id = eventId,
                UserId = userId,
                Reason = reason
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<EventDto>> GetEventByIdAsync(Guid eventId, Guid? userId = null, CancellationToken cancellationToken = default)
        {
            var query = new GetEventByIdQuery
            {
                Id = eventId,
                UserId = userId
            };

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<EventsPagedResponse>> GetEventsAsync(GetEventsRequest request, CancellationToken cancellationToken = default)
        {
            var query = new GetEventsQuery
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                Category = request.Category,
                EventType = request.EventType,
                SearchTerm = request.SearchTerm,
                Location = request.Location,
                FromDate = request.FromDate,
                ToDate = request.ToDate,
                IsOnline = request.IsOnline,
                IsFree = request.IsFree,
                IsPublic = request.IsPublic,
                SortBy = request.SortBy ?? "StartDate",
                SortDescending = request.SortDescending
            };

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<List<EventSummaryDto>>> GetFeaturedEventsAsync(int count = 6, CancellationToken cancellationToken = default)
        {
            var query = new GetFeaturedEventsQuery { Count = count };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<List<EventSummaryDto>>> GetTrendingEventsAsync(int count = 10, string timeframe = "week", CancellationToken cancellationToken = default)
        {
            var query = new GetTrendingEventsQuery { Count = count, Timeframe = timeframe };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<List<EventSummaryDto>>> GetUpcomingEventsAsync(int count = 10, CancellationToken cancellationToken = default)
        {
            var query = new GetUpcomingEventsQuery { Count = count };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<EventsPagedResponse>> GetUserEventsAsync(Guid userId, int pageNumber = 1, int pageSize = 10, string? type = null, CancellationToken cancellationToken = default)
        {
            var query = new GetUserEventsQuery
            {
                UserId = userId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Type = type
            };

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<EventCalendarDto>> GetEventCalendarAsync(int year, int month, string? category = null, string? eventType = null, CancellationToken cancellationToken = default)
        {
            var query = new GetEventCalendarQuery
            {
                Year = year,
                Month = month,
                Category = category,
                EventType = eventType
            };

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<List<EventCategoryDto>>> GetEventCategoriesAsync(bool includeEventCounts = true, CancellationToken cancellationToken = default)
        {
            var query = new GetEventCategoriesQuery { IncludeEventCounts = includeEventCounts };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<EventsStatsDto>> GetEventsStatsAsync(string? category = null, string? eventType = null, CancellationToken cancellationToken = default)
        {
            var query = new GetEventsStatsQuery
            {
                Category = category,
                EventType = eventType
            };

            return await _mediator.Send(query, cancellationToken);
        }

        // Attendance Management
        public async Task<Result<EventAttendanceDto>> AttendEventAsync(Guid eventId, Guid userId, AttendEventRequest request, CancellationToken cancellationToken = default)
        {
            var command = new AttendEventCommand
            {
                EventId = eventId,
                UserId = userId,
                Request = request
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<bool>> CancelAttendanceAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
        {
            var result = await CancelEventAttendanceAsync(eventId, userId, cancellationToken);
            return result;
        }

        public async Task<Result<EventAttendeesPagedResponse>> GetEventAttendeesAsync(Guid eventId, GetEventAttendeesRequest request, CancellationToken cancellationToken = default)
        {
            var query = new GetEventAttendeesQuery
            {
                EventId = eventId,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                AttendanceType = request.AttendanceType,
                IsApproved = request.IsApproved,
                CheckedIn = request.CheckedIn,
                SearchTerm = request.SearchTerm,
                SortBy = request.SortBy ?? "ResponseDate",
                SortDescending = request.SortDescending
            };

            var result = await _mediator.Send(query, cancellationToken);
            
            if (!result.Succeeded)
                return Result<EventAttendeesPagedResponse>.Failure(result.Errors);
                
            var response = new EventAttendeesPagedResponse
            {
                Items = result.Data.Items,
                TotalCount = result.Data.TotalCount,
                PageNumber = result.Data.PageNumber,
                PageSize = result.Data.PageSize,
                TotalPages = result.Data.TotalPages,
                HasPreviousPage = result.Data.HasPreviousPage,
                HasNextPage = result.Data.HasNextPage,
                Stats = new EventAttendanceStatsDto
                {
                    EventId = eventId,
                    TotalAttendees = result.Data.TotalCount
                }
            };
            
            return Result<EventAttendeesPagedResponse>.Success(response);
        }

        public async Task<Result<bool>> ApproveAttendanceAsync(Guid eventId, Guid attendeeId, Guid approvedBy, CancellationToken cancellationToken = default)
        {
            var command = new ApproveEventAttendanceCommand
            {
                EventId = eventId,
                AttendeeId = attendeeId,
                ApprovedBy = approvedBy
            };

            var result = await _mediator.Send(command, cancellationToken);
            return result.Succeeded ? Result<bool>.Success(true) : Result<bool>.Failure(result.Errors);
        }

        public async Task<Result<bool>> CheckInAttendeeAsync(Guid eventId, Guid attendeeId, Guid checkedInBy, CancellationToken cancellationToken = default)
        {
            var command = new CheckInEventAttendeeCommand
            {
                EventId = eventId,
                AttendeeId = attendeeId,
                CheckedInBy = checkedInBy
            };

            var result = await _mediator.Send(command, cancellationToken);
            return result.Succeeded ? Result<bool>.Success(true) : Result<bool>.Failure(result.Errors);
        }

        // Comment Management
        public async Task<Result<EventCommentDto>> CreateCommentAsync(Guid eventId, Guid userId, CreateEventCommentRequest request, CancellationToken cancellationToken = default)
        {
            return await CreateEventCommentAsync(eventId, userId, request, cancellationToken);
        }

        public async Task<Result<EventCommentDto>> UpdateCommentAsync(Guid commentId, Guid userId, UpdateEventCommentRequest request, CancellationToken cancellationToken = default)
        {
            return await UpdateEventCommentAsync(commentId, userId, request, cancellationToken);
        }

        public async Task<Result<bool>> DeleteCommentAsync(Guid commentId, Guid userId, CancellationToken cancellationToken = default)
        {
            return await DeleteEventCommentAsync(commentId, userId, false, cancellationToken);
        }

        public async Task<Result<EventCommentsPagedResponse>> GetEventCommentsAsync(Guid eventId, GetEventCommentsRequest request, CancellationToken cancellationToken = default)
        {
            var query = new GetEventCommentsQuery
            {
                EventId = eventId,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                SortBy = request.SortBy ?? "CreatedAt",
                SortDescending = request.SortDescending,
                IncludeReplies = request.IncludeReplies
            };

            var result = await _mediator.Send(query, cancellationToken);
            
            if (!result.Succeeded)
                return Result<EventCommentsPagedResponse>.Failure(result.Errors);
                
            var response = new EventCommentsPagedResponse
            {
                Items = result.Data.Items,
                TotalCount = result.Data.TotalCount,
                PageNumber = result.Data.PageNumber,
                PageSize = result.Data.PageSize,
                TotalPages = result.Data.TotalPages,
                HasPreviousPage = result.Data.HasPreviousPage,
                HasNextPage = result.Data.HasNextPage,
                TotalComments = result.Data.TotalCount,
                TotalReplies = 0 // TODO: Calculate actual replies count
            };
            
            return Result<EventCommentsPagedResponse>.Success(response);
        }

        // Invitation Management
        public async Task<Result<List<EventInvitationDto>>> SendInvitationsAsync(Guid eventId, Guid invitedBy, InviteToEventRequest request, CancellationToken cancellationToken = default)
        {
            var command = new InviteToEventCommand
            {
                EventId = eventId,
                InvitedBy = invitedBy,
                Request = request
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<bool>> AcceptInvitationAsync(Guid invitationId, CancellationToken cancellationToken = default)
        {
            // This would need a specific command - for now return a placeholder
            return Result<bool>.Success(true);
        }

        public async Task<Result<bool>> DeclineInvitationAsync(Guid invitationId, CancellationToken cancellationToken = default)
        {
            // This would need a specific command - for now return a placeholder
            return Result<bool>.Success(true);
        }

        public async Task<Result<bool>> CancelInvitationAsync(Guid invitationId, Guid cancelledBy, CancellationToken cancellationToken = default)
        {
            // This would need a specific command - for now return a placeholder
            return Result<bool>.Success(true);
        }

        // Event Updates
        public async Task<Result<List<EventUpdateDto>>> GetEventUpdatesAsync(Guid eventId, string? updateType = null, CancellationToken cancellationToken = default)
        {
            var query = new GetEventUpdatesQuery
            {
                EventId = eventId,
                UpdateType = updateType
            };

            var result = await _mediator.Send(query, cancellationToken);
            if (result.Succeeded)
            {
                return Result<List<EventUpdateDto>>.Success(result.Data.Items.ToList());
            }
            return Result<List<EventUpdateDto>>.Failure(result.ErrorMessage);
        }

        // Statistics and Analytics
        public async Task<Result<EventsStatsDto>> GetEventsStatsAsync(GetEventsStatsRequest? request = null, CancellationToken cancellationToken = default)
        {
            var query = new GetEventsStatsQuery
            {
                Category = request?.Category,
                EventType = request?.EventType,
                FromDate = request?.FromDate,
                ToDate = request?.ToDate,
                IsPublic = request?.IsPublic,
                IsActive = request?.IsActive
            };

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<EventAttendanceStatsDto>> GetEventAttendanceStatsAsync(Guid eventId, CancellationToken cancellationToken = default)
        {
            var query = new GetEventAttendanceStatsQuery
            {
                EventId = eventId
            };

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<List<EventSummaryDto>>> GetTrendingEventsAsync(string timeframe = "week", int count = 10, CancellationToken cancellationToken = default)
        {
            var query = new GetTrendingEventsQuery { Count = count, Timeframe = timeframe };
            return await _mediator.Send(query, cancellationToken);
        }

        // Admin Functions
        public async Task<Result<bool>> ModerateEventAsync(Guid eventId, Guid userId, string action, string? reason = null, CancellationToken cancellationToken = default)
        {
            // This would need specific moderation commands - for now return a placeholder
            return Result<bool>.Success(true);
        }

        // Utility Functions
        public async Task<Result<List<EventCategoryDto>>> GetEventCategoriesAsync(CancellationToken cancellationToken = default)
        {
            var query = new GetEventCategoriesQuery { IncludeEventCounts = true };
            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<EventCalendarDto>> GetEventCalendarAsync(int year, int month, GetEventCalendarRequest? request = null, CancellationToken cancellationToken = default)
        {
            var query = new GetEventCalendarQuery
            {
                Year = year,
                Month = month,
                Category = request?.Category,
                EventType = request?.EventType,
                IsOnline = request?.IsOnline,
                IsFree = request?.IsFree
            };

            return await _mediator.Send(query, cancellationToken);
        }

        public async Task<Result<List<EventSummaryDto>>> SearchEventsAsync(string searchTerm, GetEventsRequest? request = null, CancellationToken cancellationToken = default)
        {
            var query = new GetEventsQuery
            {
                SearchTerm = searchTerm,
                PageNumber = request?.PageNumber ?? 1,
                PageSize = request?.PageSize ?? 10,
                Category = request?.Category,
                EventType = request?.EventType,
                Location = request?.Location,
                FromDate = request?.FromDate,
                ToDate = request?.ToDate,
                IsOnline = request?.IsOnline,
                IsFree = request?.IsFree,
                IsPublic = request?.IsPublic,
                SortBy = request?.SortBy ?? "StartDate",
                SortDescending = request?.SortDescending ?? false
            };

            var result = await _mediator.Send(query, cancellationToken);
            if (result.Succeeded)
            {
                return Result<List<EventSummaryDto>>.Success(result.Data.Items.ToList());
            }
            return Result<List<EventSummaryDto>>.Failure(result.ErrorMessage ?? "Failed to search events");
        }

        // Keep existing methods for backward compatibility
        public async Task<Result<bool>> CancelEventAttendanceAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
        {
            var command = new CancelEventAttendanceCommand
            {
                EventId = eventId,
                UserId = userId
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<EventCommentDto>> CreateEventCommentAsync(Guid eventId, Guid userId, CreateEventCommentRequest request, CancellationToken cancellationToken = default)
        {
            var command = new CreateEventCommentCommand
            {
                EventId = eventId,
                UserId = userId,
                Request = request
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<EventCommentDto>> UpdateEventCommentAsync(Guid commentId, Guid userId, UpdateEventCommentRequest request, CancellationToken cancellationToken = default)
        {
            var command = new UpdateEventCommentCommand
            {
                CommentId = commentId,
                UserId = userId,
                Request = request
            };

            return await _mediator.Send(command, cancellationToken);
        }

        public async Task<Result<bool>> DeleteEventCommentAsync(Guid commentId, Guid userId, bool hardDelete = false, CancellationToken cancellationToken = default)
        {
            var command = new DeleteEventCommentCommand
            {
                CommentId = commentId,
                UserId = userId,
                HardDelete = hardDelete
            };

            return await _mediator.Send(command, cancellationToken);
        }

        // Event Updates
        public async Task<Result<EventUpdateDto>> CreateEventUpdateAsync(Guid eventId, Guid userId, CreateEventUpdateRequest request, CancellationToken cancellationToken = default)
        {
            var command = new CreateEventUpdateCommand
            {
                EventId = eventId,
                UserId = userId,
                Request = request
            };

            return await _mediator.Send(command, cancellationToken);
        }

        // Admin Operations
        public async Task<Result<bool>> FeatureEventAsync(Guid eventId, Guid userId, bool isFeatured = true, CancellationToken cancellationToken = default)
        {
            var command = new FeatureEventCommand
            {
                EventId = eventId,
                UserId = userId,
                IsFeatured = isFeatured
            };

            return await _mediator.Send(command, cancellationToken);
        }

        // Search and Filter
        public async Task<Result<EventsPagedResponse>> SearchEventsAsync(string searchTerm, int pageNumber = 1, int pageSize = 10, string? category = null, string? location = null, CancellationToken cancellationToken = default)
        {
            var query = new GetEventsQuery
            {
                SearchTerm = searchTerm,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Category = category,
                Location = location,
                SortBy = "StartDate",
                SortDescending = false
            };

            return await _mediator.Send(query, cancellationToken);
        }

        // Validation Methods
        public async Task<Result<bool>> CanUserEditEventAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
        {
            // This would typically call a repository method or query
            // For now, we'll create a simple validation query
            var eventResult = await GetEventByIdAsync(eventId, userId, cancellationToken);
            if (!eventResult.Succeeded)
            {
                return Result<bool>.Failure("Event not found");
            }

            var canEdit = eventResult.Data.Organizer.Id == userId;
            return Result<bool>.Success(canEdit);
        }

        public async Task<Result<bool>> IsEventFullAsync(Guid eventId, CancellationToken cancellationToken = default)
        {
            var eventResult = await GetEventByIdAsync(eventId, cancellationToken: cancellationToken);
            if (!eventResult.Succeeded)
            {
                return Result<bool>.Failure("Event not found");
            }

            var eventData = eventResult.Data;
            if (!eventData.MaxAttendees.HasValue)
            {
                return Result<bool>.Success(false); // No limit, so not full
            }

            var isFull = eventData.AttendeeCount >= eventData.MaxAttendees.Value;
            return Result<bool>.Success(isFull);
        }

        public async Task<Result<bool>> IsUserEventOrganizerAsync(Guid eventId, Guid userId, CancellationToken cancellationToken = default)
        {
            var eventResult = await GetEventByIdAsync(eventId, userId, cancellationToken);
            if (!eventResult.Succeeded)
            {
                return Result<bool>.Failure("Event not found");
            }

            var isOrganizer = eventResult.Data.Organizer.Id == userId;
            return Result<bool>.Success(isOrganizer);
        }

        public async Task<Result<bool>> IsEventActiveAsync(Guid eventId, CancellationToken cancellationToken = default)
        {
            var eventResult = await GetEventByIdAsync(eventId, cancellationToken: cancellationToken);
            if (!eventResult.Succeeded)
            {
                return Result<bool>.Failure("Event not found");
            }

            var isActive = eventResult.Data.IsActive && eventResult.Data.Status == "Active";
            return Result<bool>.Success(isActive);
        }
    }
}
