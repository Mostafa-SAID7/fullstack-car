using Application.Common.Models;
using Application.Features.Community.QA.DTOs.Shared;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Extensions;

/// <summary>
/// Extension methods for creating consistent API responses using shared DTOs
/// Works efficiently with both Angular and React frontends
/// </summary>
public static class ApiResponseExtensions
{
    /// <summary>
    /// Creates a successful API response with data
    /// </summary>
    public static IActionResult ApiSuccess<T>(this ControllerBase controller, T data, string? message = null, int statusCode = 200)
    {
        var response = ApiResponseDto<T>.Success(data, message, statusCode);
        return new ObjectResult(response) { StatusCode = statusCode };
    }

    /// <summary>
    /// Creates a successful API response without data
    /// </summary>
    public static IActionResult ApiSuccess(this ControllerBase controller, string? message = null, int statusCode = 200)
    {
        var response = ApiResponseDto.Success(message, statusCode);
        return new ObjectResult(response) { StatusCode = statusCode };
    }

    /// <summary>
    /// Creates a paginated API response
    /// </summary>
    public static IActionResult ApiPaginatedSuccess<T>(
        this ControllerBase controller, 
        List<T> items, 
        int pageNumber, 
        int pageSize, 
        int totalCount, 
        string? message = null)
    {
        var response = PaginatedApiResponseDto<T>.Success(items, pageNumber, pageSize, totalCount, message);
        return controller.Ok(response);
    }

    /// <summary>
    /// Creates a paginated API response from PaginatedList
    /// </summary>
    public static IActionResult ApiPaginatedSuccess<T>(
        this ControllerBase controller, 
        PaginatedList<T> paginatedList, 
        string? message = null)
    {
        var response = PaginatedApiResponseDto<T>.Success(
            paginatedList.Items, 
            paginatedList.PageNumber, 
            paginatedList.Items.Count, // Use actual page size from items
            paginatedList.TotalCount, 
            message);
        return controller.Ok(response);
    }

    /// <summary>
    /// Creates a bad request API response
    /// </summary>
    public static IActionResult ApiBadRequest<T>(this ControllerBase controller, string[] errors, string? message = null)
    {
        var response = ApiResponseDto<T>.Failure(errors, message, 400);
        return controller.BadRequest(response);
    }

    /// <summary>
    /// Creates a bad request API response with single error
    /// </summary>
    public static IActionResult ApiBadRequest<T>(this ControllerBase controller, string error, string? message = null)
    {
        var response = ApiResponseDto<T>.Failure(error, message, 400);
        return controller.BadRequest(response);
    }

    /// <summary>
    /// Creates a paginated bad request API response
    /// </summary>
    public static IActionResult ApiPaginatedBadRequest<T>(this ControllerBase controller, string[] errors, string? message = null)
    {
        var response = PaginatedApiResponseDto<T>.Failure(errors, message, 400);
        return controller.BadRequest(response);
    }

    /// <summary>
    /// Creates a not found API response
    /// </summary>
    public static IActionResult ApiNotFound(this ControllerBase controller, string resource, string? identifier = null)
    {
        var response = ErrorResponseDto.NotFound(resource, identifier, controller.Request.Path);
        return controller.NotFound(response);
    }

    /// <summary>
    /// Creates an unauthorized API response
    /// </summary>
    public static IActionResult ApiUnauthorized(this ControllerBase controller, string? message = null)
    {
        var response = ErrorResponseDto.Unauthorized(message, controller.Request.Path);
        return controller.Unauthorized(response);
    }

    /// <summary>
    /// Creates a forbidden API response
    /// </summary>
    public static IActionResult ApiForbidden(this ControllerBase controller, string? message = null)
    {
        var response = ErrorResponseDto.Forbidden(message, controller.Request.Path);
        return new ObjectResult(response) { StatusCode = 403 };
    }

    /// <summary>
    /// Creates a validation error API response
    /// </summary>
    public static IActionResult ApiValidationError(this ControllerBase controller, List<ValidationErrorDto> validationErrors)
    {
        var response = ErrorResponseDto.ValidationError(validationErrors, controller.Request.Path);
        return new ObjectResult(response) { StatusCode = 422 };
    }

    /// <summary>
    /// Creates an API response from Result pattern
    /// </summary>
    public static IActionResult ApiFromResult<T>(this ControllerBase controller, Result<T> result, string? successMessage = null)
    {
        if (result.IsSuccess)
        {
            return controller.ApiSuccess(result.Data, successMessage);
        }

        return controller.ApiBadRequest<T>(result.Errors, result.ErrorMessage);
    }

    /// <summary>
    /// Creates a paginated API response from Result<PaginatedList<T>> pattern
    /// </summary>
    public static IActionResult ApiFromPaginatedResult<T>(this ControllerBase controller, Result<PaginatedList<T>> result, string? successMessage = null)
    {
        if (result.IsSuccess)
        {
            return controller.ApiPaginatedSuccess(result.Data, successMessage);
        }

        return controller.ApiPaginatedBadRequest<T>(result.Errors, result.ErrorMessage);
    }

    /// <summary>
    /// Creates a created API response
    /// </summary>
    public static IActionResult ApiCreated<T>(this ControllerBase controller, T data, string actionName, object routeValues, string? message = null)
    {
        var response = ApiResponseDto<T>.Success(data, message ?? "Resource created successfully", 201);
        return controller.CreatedAtAction(actionName, routeValues, response);
    }

    /// <summary>
    /// Creates a no content API response
    /// </summary>
    public static IActionResult ApiNoContent(this ControllerBase controller, string? message = null)
    {
        var response = ApiResponseDto.Success(message ?? "Operation completed successfully", 204);
        return new ObjectResult(response) { StatusCode = 204 };
    }
}