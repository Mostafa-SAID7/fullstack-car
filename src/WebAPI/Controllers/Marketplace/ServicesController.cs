using Application.Features.Marketplace.Services.Commands;
using Application.Features.Marketplace.Services.DTOs.Requests;
using Application.Features.Marketplace.Services.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Marketplace
{
    [ApiController]
    [ApiVersion("6.0")]
    [Route("api/v{version:apiVersion}/marketplace/services")]
    [Authorize]
    public class ServicesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ServicesController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetServices([FromQuery] GetCarServicesQuery query)
        {
            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Services retrieved successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to retrieve services"
            });
        }
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetService(Guid id)
        {
            var query = new GetCarServiceByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Service retrieved successfully"
                });
            }

            return NotFound(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Service not found"
            });
        }
        [HttpPost]
        public async Task<IActionResult> CreateService([FromBody] CreateCarServiceRequest request, [FromQuery] Guid serviceProviderId)
        {
            var command = new CreateCarServiceCommand
            {
                ServiceProviderId = serviceProviderId,
                Request = request
            };

            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return CreatedAtAction(
                    nameof(GetService),
                    new { id = result.Data.Id },
                    new
                    {
                        Success = true,
                        Data = result.Data,
                        Message = "Service created successfully"
                    });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to create service"
            });
        }
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateService(Guid id, [FromBody] UpdateCarServiceRequest request)
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

            var command = new UpdateCarServiceCommand
            {
                Id = id,
                UserId = userGuid,
                Request = request
            };

            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Service updated successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to update service"
            });
        }
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteService(Guid id)
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

            var command = new DeleteCarServiceCommand
            {
                Id = id,
                UserId = userGuid
            };

            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Message = "Service deleted successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to delete service"
            });
        }
        [HttpGet("provider/{providerId:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetServicesByProvider(Guid providerId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var query = new GetServicesByProviderQuery
            {
                ServiceProviderId = providerId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Services retrieved successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to retrieve services"
            });
        }
        [HttpGet("search/location")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchServicesByLocation(
            [FromQuery] double latitude,
            [FromQuery] double longitude,
            [FromQuery] double radiusKm = 10,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new SearchServicesByLocationQuery
            {
                Latitude = latitude,
                Longitude = longitude,
                RadiusKm = radiusKm,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Services retrieved successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to retrieve services"
            });
        }
        [HttpGet("export")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ExportServices(
            [FromQuery] string format = "csv",
            [FromQuery] string? searchTerm = null,
            [FromQuery] Domain.Enums.Marketplace.ServiceType? type = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] bool? isEmergencyService = null,
            [FromQuery] bool? isAvailable24x7 = null,
            [FromQuery] decimal? minRating = null)
        {
            var query = new ExportServicesQuery
            {
                Format = format,
                SearchTerm = searchTerm,
                Type = type,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                IsEmergencyService = isEmergencyService,
                IsAvailable24x7 = isAvailable24x7,
                MinRating = minRating
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                var contentType = format.ToLower() == "csv" ? "text/csv" : "application/json";
                var fileName = $"services-export-{DateTime.UtcNow:yyyyMMdd-HHmmss}.{format.ToLower()}";
                
                return File(result.Data, contentType, fileName);
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to export services"
            });
        }
        [HttpGet("popular")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPopularServices(
            [FromQuery] int limit = 10,
            [FromQuery] string period = "30d")
        {
            var query = new GetPopularServicesQuery
            {
                Limit = limit,
                Period = period
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Popular services retrieved successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to retrieve popular services"
            });
        }
        [HttpGet("statistics")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetServiceStatistics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            var query = new GetServiceStatisticsQuery
            {
                FromDate = fromDate,
                ToDate = toDate
            };

            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Service statistics retrieved successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to retrieve service statistics"
            });
        }
    }

    // Placeholder classes for missing queries and commands
    public class GetCarServicesQuery : IRequest<Application.Common.Models.Result<Application.Common.Models.PaginatedList<Application.Features.Marketplace.Services.DTOs.Responses.CarServiceDto>>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public Domain.Enums.Marketplace.ServiceType? Type { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? IsEmergencyService { get; set; }
        public bool? IsAvailable24x7 { get; set; }
        public decimal? MinRating { get; set; }
        public string? SortBy { get; set; } = "CreatedAt";
        public bool SortDescending { get; set; } = true;
    }

    public class GetCarServiceByIdQuery : IRequest<Application.Common.Models.Result<Application.Features.Marketplace.Services.DTOs.Responses.CarServiceDto>>
    {
        public Guid Id { get; set; }
    }

    public class UpdateCarServiceRequest
    {
        // Add properties as needed
    }

    public class UpdateCarServiceCommand : IRequest<Application.Common.Models.Result<Application.Features.Marketplace.Services.DTOs.Responses.CarServiceDto>>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public UpdateCarServiceRequest Request { get; set; } = null!;
    }

    public class DeleteCarServiceCommand : IRequest<Application.Common.Models.Result<bool>>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
    }

    public class GetServicesByProviderQuery : IRequest<Application.Common.Models.Result<Application.Common.Models.PaginatedList<Application.Features.Marketplace.Services.DTOs.Responses.CarServiceDto>>>
    {
        public Guid ServiceProviderId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class SearchServicesByLocationQuery : IRequest<Application.Common.Models.Result<Application.Common.Models.PaginatedList<Application.Features.Marketplace.Services.DTOs.Responses.CarServiceDto>>>
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double RadiusKm { get; set; } = 10;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
