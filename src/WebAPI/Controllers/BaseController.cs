using Application.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Common;

namespace WebAPI.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        private ISender? _mediator;
        protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();

        /// <summary>
        /// Creates a standardized success response with data
        /// </summary>
        protected IActionResult Success<T>(T data, string message = "Operation completed successfully")
        {
            return ApiResponseWrapper.Success(data, message);
        }

        /// <summary>
        /// Creates a standardized success response without data
        /// </summary>
        protected IActionResult Success(string message = "Operation completed successfully")
        {
            return ApiResponseWrapper.Success(message);
        }

        /// <summary>
        /// Creates a standardized created response
        /// </summary>
        protected IActionResult Created<T>(T data, string location, string message = "Resource created successfully")
        {
            return ApiResponseWrapper.Created(data, location, message);
        }

        /// <summary>
        /// Creates a standardized bad request response
        /// </summary>
        protected IActionResult BadRequest(string message, IEnumerable<string>? errors = null)
        {
            return ApiResponseWrapper.BadRequest(message, errors);
        }

        /// <summary>
        /// Creates a standardized not found response
        /// </summary>
        protected new IActionResult NotFound(string message = "Resource not found")
        {
            return ApiResponseWrapper.NotFound(message);
        }

        /// <summary>
        /// Creates a standardized unauthorized response
        /// </summary>
        protected new IActionResult Unauthorized(string message = "User not authenticated")
        {
            return ApiResponseWrapper.Unauthorized(message);
        }

        /// <summary>
        /// Creates a standardized forbidden response
        /// </summary>
        protected IActionResult Forbidden(string message = "Access denied")
        {
            return ApiResponseWrapper.Forbidden(message);
        }

        /// <summary>
        /// Creates a standardized internal server error response
        /// </summary>
        protected IActionResult InternalServerError(string message = "An internal server error occurred", string? error = null)
        {
            return ApiResponseWrapper.InternalServerError(message, error);
        }

        /// <summary>
        /// Creates a response based on Result pattern
        /// </summary>
        protected IActionResult FromResult(Result result, string? successMessage = null)
        {
            return ApiResponseWrapper.FromResult(result, successMessage);
        }

        /// <summary>
        /// Creates a response based on Result<T> pattern
        /// </summary>
        protected IActionResult FromResult<T>(Result<T> result, string? successMessage = null)
        {
            return ApiResponseWrapper.FromResult(result, successMessage);
        }

        /// <summary>
        /// Creates a created response based on Result<T> pattern
        /// </summary>
        protected IActionResult FromResultCreated<T>(Result<T> result, string location, string? successMessage = null)
        {
            return ApiResponseWrapper.FromResultCreated(result, location, successMessage);
        }

        /// <summary>
        /// Creates a not found response based on Result<T> pattern
        /// </summary>
        protected IActionResult FromResultNotFound<T>(Result<T> result)
        {
            return ApiResponseWrapper.FromResultNotFound(result);
        }
    }
}
