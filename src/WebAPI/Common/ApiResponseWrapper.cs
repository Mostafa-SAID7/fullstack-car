using Application.Common.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Common;

/// <summary>
/// Standardized API response wrapper to ensure consistent response format across all endpoints
/// </summary>
public static class ApiResponseWrapper
{
    /// <summary>
    /// Creates a successful response with data
    /// </summary>
    public static IActionResult Success<T>(T data, string message = "Operation completed successfully")
    {
        return new OkObjectResult(new
        {
            Success = true,
            Data = data,
            Message = message,
            Timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Creates a successful response without data
    /// </summary>
    public static IActionResult Success(string message = "Operation completed successfully")
    {
        return new OkObjectResult(new
        {
            Success = true,
            Message = message,
            Timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Creates a created response with data and location
    /// </summary>
    public static IActionResult Created<T>(T data, string location, string message = "Resource created successfully")
    {
        var response = new ObjectResult(new
        {
            Success = true,
            Data = data,
            Message = message,
            Timestamp = DateTime.UtcNow
        })
        {
            StatusCode = 201
        };

        if (!string.IsNullOrEmpty(location))
        {
            response.Value = new
            {
                Success = true,
                Data = data,
                Message = message,
                Location = location,
                Timestamp = DateTime.UtcNow
            };
        }

        return response;
    }

    /// <summary>
    /// Creates a bad request response with errors
    /// </summary>
    public static IActionResult BadRequest(string message, IEnumerable<string>? errors = null)
    {
        return new BadRequestObjectResult(new
        {
            Success = false,
            Message = message,
            Errors = errors?.ToArray() ?? Array.Empty<string>(),
            Timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Creates a bad request response from Result
    /// </summary>
    public static IActionResult BadRequest(Result result)
    {
        return new BadRequestObjectResult(new
        {
            Success = false,
            Message = result.ErrorMessage ?? "Operation failed",
            Errors = result.Errors,
            Timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Creates a not found response
    /// </summary>
    public static IActionResult NotFound(string message = "Resource not found")
    {
        return new NotFoundObjectResult(new
        {
            Success = false,
            Message = message,
            Timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Creates a not found response from Result
    /// </summary>
    public static IActionResult NotFound(Result result)
    {
        return new NotFoundObjectResult(new
        {
            Success = false,
            Message = result.ErrorMessage ?? "Resource not found",
            Errors = result.Errors,
            Timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Creates an unauthorized response
    /// </summary>
    public static IActionResult Unauthorized(string message = "User not authenticated")
    {
        return new UnauthorizedObjectResult(new
        {
            Success = false,
            Message = message,
            Timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Creates a forbidden response
    /// </summary>
    public static IActionResult Forbidden(string message = "Access denied")
    {
        return new ObjectResult(new
        {
            Success = false,
            Message = message,
            Timestamp = DateTime.UtcNow
        })
        {
            StatusCode = 403
        };
    }

    /// <summary>
    /// Creates an internal server error response
    /// </summary>
    public static IActionResult InternalServerError(string message = "An internal server error occurred", string? error = null)
    {
        var response = new
        {
            Success = false,
            Message = message,
            Timestamp = DateTime.UtcNow
        };

        if (!string.IsNullOrEmpty(error))
        {
            return new ObjectResult(new
            {
                Success = false,
                Message = message,
                Error = error,
                Timestamp = DateTime.UtcNow
            })
            {
                StatusCode = 500
            };
        }

        return new ObjectResult(response)
        {
            StatusCode = 500
        };
    }

    /// <summary>
    /// Creates a file response for downloads
    /// </summary>
    public static IActionResult File(byte[] fileContents, string contentType, string fileName)
    {
        return new FileContentResult(fileContents, contentType)
        {
            FileDownloadName = fileName
        };
    }

    /// <summary>
    /// Creates a response based on Result pattern
    /// </summary>
    public static IActionResult FromResult(Result result, string? successMessage = null)
    {
        if (result.IsSuccess)
        {
            return Success(successMessage ?? "Operation completed successfully");
        }

        return BadRequest(result);
    }

    /// <summary>
    /// Creates a response based on Result<T> pattern
    /// </summary>
    public static IActionResult FromResult<T>(Result<T> result, string? successMessage = null)
    {
        if (result.IsSuccess)
        {
            return Success(result.Data, successMessage ?? "Operation completed successfully");
        }

        return BadRequest(result.ErrorMessage ?? "Operation failed", result.Errors);
    }

    /// <summary>
    /// Creates a created response based on Result<T> pattern
    /// </summary>
    public static IActionResult FromResultCreated<T>(Result<T> result, string location, string? successMessage = null)
    {
        if (result.IsSuccess)
        {
            return Created(result.Data, location, successMessage ?? "Resource created successfully");
        }

        return BadRequest(result.ErrorMessage ?? "Failed to create resource", result.Errors);
    }

    /// <summary>
    /// Creates a not found response based on Result<T> pattern
    /// </summary>
    public static IActionResult FromResultNotFound<T>(Result<T> result)
    {
        if (result.IsSuccess)
        {
            return Success(result.Data);
        }

        return NotFound(result);
    }
}