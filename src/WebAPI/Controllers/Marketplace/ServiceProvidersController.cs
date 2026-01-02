using Application.Features.Marketplace.ServiceProviders.Commands;
using Application.Features.Marketplace.ServiceProviders.DTOs.Requests;
using Application.Features.Marketplace.ServiceProviders.Queries;
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers.Marketplace
{
    [ApiController]
    [ApiVersion("6.0")]
    [Route("api/v{version:apiVersion}/marketplace/service-providers")]
    [Authorize]
    public class ServiceProvidersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ServiceProvidersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get all service providers with filtering and pagination
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetServiceProviders([FromQuery] GetServiceProvidersQuery query)
        {
            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Service providers retrieved successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to retrieve service providers"
            });
        }

        /// <summary>
        /// Get service provider by ID
        /// </summary>
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetServiceProvider(Guid id)
        {
            var query = new GetServiceProviderByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    Success = true,
                    Data = result.Data,
                    Message = "Service provider retrieved successfully"
                });
            }

            return NotFound(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Service provider not found"
            });
        }

        /// <summary>
        /// Create a new service provider
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateServiceProvider([FromBody] CreateServiceProviderRequest request)
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

            var command = new CreateServiceProviderCommand
            {
                UserId = userGuid,
                Request = request
            };

            var result = await _mediator.Send(command);
            
            if (result.IsSuccess)
            {
                return CreatedAtAction(
                    nameof(GetServiceProvider),
                    new { id = result.Data.Id },
                    new
                    {
                        Success = true,
                        Data = result.Data,
                        Message = "Service provider created successfully"
                    });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to create service provider"
            });
        }

        /// <summary>
        /// Update service provider
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateServiceProvider(Guid id, [FromBody] UpdateServiceProviderRequest request)
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

            var command = new UpdateServiceProviderCommand
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
                    Message = "Service provider updated successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to update service provider"
            });
        }

        /// <summary>
        /// Delete service provider
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteServiceProvider(Guid id)
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

            var command = new DeleteServiceProviderCommand
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
                    Message = "Service provider deleted successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to delete service provider"
            });
        }

        /// <summary>
        /// Get my service providers (for authenticated user)
        /// </summary>
        [HttpGet("my-providers")]
        public async Task<IActionResult> GetMyServiceProviders([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
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

            var query = new GetMyServiceProvidersQuery
            {
                UserId = userGuid,
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
                    Message = "My service providers retrieved successfully"
                });
            }

            return BadRequest(new
            {
                Success = false,
                Errors = result.Errors,
                Message = "Failed to retrieve service providers"
            });
        }
    }

    // Placeholder classes for missing queries and commands
    public class GetServiceProviderByIdQuery : IRequest<Application.Common.Models.Result<Application.Features.Marketplace.ServiceProviders.DTOs.Responses.ServiceProviderDto>>
    {
        public Guid Id { get; set; }
    }

    public class UpdateServiceProviderCommand : IRequest<Application.Common.Models.Result<Application.Features.Marketplace.ServiceProviders.DTOs.Responses.ServiceProviderDto>>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public UpdateServiceProviderRequest Request { get; set; } = null!;
    }

    public class DeleteServiceProviderCommand : IRequest<Application.Common.Models.Result<bool>>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
    }

    public class GetMyServiceProvidersQuery : IRequest<Application.Common.Models.Result<Application.Common.Models.PaginatedList<Application.Features.Marketplace.ServiceProviders.DTOs.Responses.ServiceProviderDto>>>
    {
        public Guid UserId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
