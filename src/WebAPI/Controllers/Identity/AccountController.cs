using Application.Features.Identity.Commands;
using Application.Features.Identity.DTOs.Requests;
using Application.Common.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers.Identity
{
    [ApiController]
    [Route("api/account")]
    [Tags("Identity - Account Management")]
    [Produces("application/json")]
    public class AccountController : BaseController
    {
        [HttpPost("forgot-password")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status429TooManyRequests)]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var command = new ForgotPasswordCommand { Request = request };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new ApiResponse
                {
                    Message = "If the email exists, a password reset link has been sent",
                    Success = true
                });

            return BadRequest(result.Errors);
        }

        [HttpPost("reset-password")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status410Gone)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var command = new ResetPasswordCommand { Request = request };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new ApiResponse { Message = "Password reset successful", Success = true });

            return BadRequest(result.Errors);
        }

        [HttpGet("verify-email")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status410Gone)]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token, [FromQuery] string email)
        {
            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(email))
            {
                return BadRequest(new ErrorResponse { Message = "Token and email are required", Success = false });
            }

            var command = new VerifyEmailCommand { Token = token, Email = email };
            var result = await Mediator.Send(command);

            if (result.Succeeded)
                return Ok(new ApiResponse { Message = "Email verified successfully", Success = true });

            return BadRequest(result.Errors);
        }
    }
}
