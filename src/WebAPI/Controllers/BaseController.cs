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
        protected IActionResult Success<T>(T data, string message = "Operation completed successfully")
        {
            return ApiResponseWrapper.Success(data, message);
        }
        protected IActionResult Success(string message = "Operation completed successfully")
        {
            return ApiResponseWrapper.Success(message);
        }
        protected IActionResult Created<T>(T data, string location, string message = "Resource created successfully")
        {
            return ApiResponseWrapper.Created(data, location, message);
        }
        protected IActionResult BadRequest(string message, IEnumerable<string>? errors = null)
        {
            return ApiResponseWrapper.BadRequest(message, errors);
        }
        protected new IActionResult NotFound(string message = "Resource not found")
        {
            return ApiResponseWrapper.NotFound(message);
        }
        protected new IActionResult Unauthorized(string message = "User not authenticated")
        {
            return ApiResponseWrapper.Unauthorized(message);
        }
        protected IActionResult Forbidden(string message = "Access denied")
        {
            return ApiResponseWrapper.Forbidden(message);
        }
        protected IActionResult InternalServerError(string message = "An internal server error occurred", string? error = null)
        {
            return ApiResponseWrapper.InternalServerError(message, error);
        }
        protected IActionResult FromResult(Result result, string? successMessage = null)
        {
            return ApiResponseWrapper.FromResult(result, successMessage);
        }
        protected IActionResult FromResult<T>(Result<T> result, string? successMessage = null)
        {
            return ApiResponseWrapper.FromResult(result, successMessage);
        }
        protected IActionResult FromResultCreated<T>(Result<T> result, string location, string? successMessage = null)
        {
            return ApiResponseWrapper.FromResultCreated(result, location, successMessage);
        }
        protected IActionResult FromResultNotFound<T>(Result<T> result)
        {
            return ApiResponseWrapper.FromResultNotFound(result);
        }
    }
}
