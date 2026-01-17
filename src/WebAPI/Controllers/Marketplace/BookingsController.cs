using Application.Features.Marketplace.Bookings.Commands;
using Application.Features.Marketplace.Bookings.DTOs.Requests;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Marketplace
{
    [ApiController]
    [ApiVersion("6.0")]
    [Route("api/v{version:apiVersion}/marketplace/bookings")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BookingsController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet]
        public async Task<IActionResult> GetMyBookings([FromQuery] GetMyBookingsQuery query)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            query.UserId = userGuid;
            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Bookings retrieved successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to retrieve bookings"
            });
        }
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetBooking(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var query = new GetBookingByIdQuery 
            { 
                Id = id,
                UserId = userGuid
            };
            
            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Booking retrieved successfully"
                });
            }

            return NotFound(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Booking not found"
            });
        }
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var command = new CreateBookingCommand
            {
                CustomerId = userGuid,
                Request = request
            };

            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return CreatedAtAction(
                    nameof(GetBooking),
                    new { id = result.Data.Id },
                    new
                    {
                        Success = true,
                        Data = result.Data,
                        Message = "Booking created successfully"
                    });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to create booking"
            });
        }
        [HttpPost("{id:guid}/cancel")]
        public async Task<IActionResult> CancelBooking(Guid id, [FromBody] CancelBookingRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var command = new CancelBookingCommand
            {
                BookingId = id,
                UserId = userGuid,
                CancellationReason = request.CancellationReason
            };

            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Booking cancelled successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to cancel booking"
            });
        }
        [HttpPost("{id:guid}/confirm")]
        public async Task<IActionResult> ConfirmBooking(Guid id, [FromBody] ConfirmBookingRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var command = new ConfirmBookingCommand
            {
                BookingId = id,
                UserId = userGuid,
                ProviderNotes = request.ProviderNotes
            };

            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Booking confirmed successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to confirm booking"
            });
        }
        [HttpPost("{id:guid}/complete")]
        public async Task<IActionResult> CompleteBooking(Guid id, [FromBody] CompleteBookingRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            var command = new CompleteBookingCommand
            {
                BookingId = id,
                UserId = userGuid,
                CompletionNotes = request.CompletionNotes
            };

            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Booking completed successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to complete booking"
            });
        }
        [HttpGet("provider/{providerId:guid}")]
        public async Task<IActionResult> GetProviderBookings(Guid providerId, [FromQuery] GetProviderBookingsQuery query)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message = "User not authenticated"
                });
            }

            query.ServiceProviderId = providerId;
            query.UserId = userGuid;
            
            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Provider bookings retrieved successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to retrieve provider bookings"
            });
        }
    }

    // Placeholder classes for missing queries and commands
    public class GetMyBookingsQuery : IRequest<Application.Common.Models.Result<Application.Common.Models.PaginatedList<Application.Features.Marketplace.Bookings.DTOs.Responses.ServiceBookingDto>>>
    {
        public Guid UserId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public Domain.Enums.Marketplace.BookingStatus? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class GetBookingByIdQuery : IRequest<Application.Common.Models.Result<Application.Features.Marketplace.Bookings.DTOs.Responses.ServiceBookingDto>>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
    }

    public class CancelBookingRequest
    {
        public string? CancellationReason { get; set; }
    }

    public class CancelBookingCommand : IRequest<Application.Common.Models.Result<Application.Features.Marketplace.Bookings.DTOs.Responses.ServiceBookingDto>>
    {
        public Guid BookingId { get; set; }
        public Guid UserId { get; set; }
        public string? CancellationReason { get; set; }
    }

    public class ConfirmBookingRequest
    {
        public string? ProviderNotes { get; set; }
    }

    public class ConfirmBookingCommand : IRequest<Application.Common.Models.Result<Application.Features.Marketplace.Bookings.DTOs.Responses.ServiceBookingDto>>
    {
        public Guid BookingId { get; set; }
        public Guid UserId { get; set; }
        public string? ProviderNotes { get; set; }
    }

    public class CompleteBookingRequest
    {
        public string? CompletionNotes { get; set; }
    }

    public class CompleteBookingCommand : IRequest<Application.Common.Models.Result<Application.Features.Marketplace.Bookings.DTOs.Responses.ServiceBookingDto>>
    {
        public Guid BookingId { get; set; }
        public Guid UserId { get; set; }
        public string? CompletionNotes { get; set; }
    }

    public class GetProviderBookingsQuery : IRequest<Application.Common.Models.Result<Application.Common.Models.PaginatedList<Application.Features.Marketplace.Bookings.DTOs.Responses.ServiceBookingDto>>>
    {
        public Guid ServiceProviderId { get; set; }
        public Guid UserId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public Domain.Enums.Marketplace.BookingStatus? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
