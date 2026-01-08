using Application.Features.Identity.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Attributes;
using Asp.Versioning;

namespace WebAPI.Controllers.Media
{
    [ApiVersion("7.0")]
    [Route("api/v{version:apiVersion}/media/auth")]
    public class MediaAuthController : BaseController
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly ILogger<MediaAuthController> _logger;

        public MediaAuthController(
            ICurrentUserService currentUserService,
            ILogger<MediaAuthController> logger)
        {
            _currentUserService = currentUserService;
            _logger = logger;
        }

        /// <summary>
        /// Test endpoint for authenticated users
        /// </summary>
        [HttpGet("test-auth")]
        [Authorize]
        public IActionResult TestAuth()
        {
            try
            {
                var userData = new
                {
                    UserId = _currentUserService.UserId,
                    UserName = _currentUserService.UserName,
                    Email = _currentUserService.Email,
                    IsAuthenticated = _currentUserService.IsAuthenticated,
                    Roles = _currentUserService.Roles,
                    IsActive = _currentUserService.IsActive,
                    IsEmailConfirmed = _currentUserService.IsEmailConfirmed
                };

                return Success(userData, "Authentication successful");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in TestAuth endpoint");
                return InternalServerError("Authentication test failed", ex.Message);
            }
        }

        /// <summary>
        /// Test endpoint for admin users only
        /// </summary>
        [HttpGet("test-admin")]
        [AdminOnly]
        public IActionResult TestAdmin()
        {
            try
            {
                var adminData = new
                {
                    UserId = _currentUserService.UserId,
                    UserName = _currentUserService.UserName,
                    Roles = _currentUserService.Roles
                };

                return Success(adminData, "Admin access granted");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in TestAdmin endpoint");
                return InternalServerError("Admin test failed", ex.Message);
            }
        }

        /// <summary>
        /// Test endpoint for content creators
        /// </summary>
        [HttpGet("test-content-creator")]
        [ContentCreator]
        public IActionResult TestContentCreator()
        {
            try
            {
                var creatorData = new
                {
                    UserId = _currentUserService.UserId,
                    UserName = _currentUserService.UserName,
                    Roles = _currentUserService.Roles
                };

                return Success(creatorData, "Content creator access granted");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in TestContentCreator endpoint");
                return InternalServerError("Content creator test failed", ex.Message);
            }
        }

        /// <summary>
        /// Test endpoint for media upload permissions
        /// </summary>
        [HttpGet("test-media-upload")]
        [MediaUpload]
        public IActionResult TestMediaUpload()
        {
            try
            {
                var uploadData = new
                {
                    UserId = _currentUserService.UserId,
                    UserName = _currentUserService.UserName,
                    Roles = _currentUserService.Roles
                };

                return Success(uploadData, "Media upload access granted");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in TestMediaUpload endpoint");
                return InternalServerError("Media upload test failed", ex.Message);
            }
        }

        /// <summary>
        /// Test endpoint for moderators and admins
        /// </summary>
        [HttpGet("test-moderator")]
        [ModeratorOrAdmin]
        public IActionResult TestModerator()
        {
            try
            {
                var moderatorData = new
                {
                    UserId = _currentUserService.UserId,
                    UserName = _currentUserService.UserName,
                    Roles = _currentUserService.Roles
                };

                return Success(moderatorData, "Moderator access granted");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in TestModerator endpoint");
                return InternalServerError("Moderator test failed", ex.Message);
            }
        }

        /// <summary>
        /// Test endpoint for active users
        /// </summary>
        [HttpGet("test-active-user")]
        [ActiveUser]
        public IActionResult TestActiveUser()
        {
            try
            {
                var activeUserData = new
                {
                    UserId = _currentUserService.UserId,
                    UserName = _currentUserService.UserName,
                    IsActive = _currentUserService.IsActive
                };

                return Success(activeUserData, "Active user access granted");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in TestActiveUser endpoint");
                return InternalServerError("Active user test failed", ex.Message);
            }
        }

        /// <summary>
        /// Test endpoint for verified users
        /// </summary>
        [HttpGet("test-verified-user")]
        [VerifiedUser]
        public IActionResult TestVerifiedUser()
        {
            try
            {
                var verifiedUserData = new
                {
                    UserId = _currentUserService.UserId,
                    UserName = _currentUserService.UserName,
                    IsEmailConfirmed = _currentUserService.IsEmailConfirmed,
                    IsActive = _currentUserService.IsActive
                };

                return Success(verifiedUserData, "Verified user access granted");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in TestVerifiedUser endpoint");
                return InternalServerError("Verified user test failed", ex.Message);
            }
        }

        /// <summary>
        /// Get current user information
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            try
            {
                if (!_currentUserService.IsAuthenticated)
                {
                    return Unauthorized("User is not authenticated");
                }

                var currentUserData = new
                {
                    UserId = _currentUserService.UserId,
                    UserName = _currentUserService.UserName,
                    Email = _currentUserService.Email,
                    IsAuthenticated = _currentUserService.IsAuthenticated,
                    Roles = _currentUserService.Roles.ToList(),
                    IsActive = _currentUserService.IsActive,
                    IsEmailConfirmed = _currentUserService.IsEmailConfirmed,
                    Claims = new
                    {
                        IsActive = _currentUserService.GetClaim("isActive"),
                        EmailVerified = _currentUserService.GetClaim("email_verified"),
                        AllRoles = _currentUserService.GetClaims("role").ToList()
                    }
                };

                return Success(currentUserData, "Current user information retrieved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving current user information");
                return InternalServerError("Failed to retrieve user information", ex.Message);
            }
        }
    }
}