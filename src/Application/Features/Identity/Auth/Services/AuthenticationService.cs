using Application.Features.Identity.Auth.Interfaces;
using Application.Features.Identity.Core.Interfaces;
using Application.Common.Models;
using Application.Features.Identity.Auth.DTOs.Requests;
using Application.Features.Identity.Auth.DTOs.Responses;
using Application.Features.Identity.Profile.DTOs.Responses;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace Application.Features.Identity.Auth.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthenticationService> _logger;
        private readonly int _refreshTokenExpirationDays;

        public AuthenticationService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IJwtTokenService jwtTokenService,
            IRefreshTokenRepository refreshTokenRepository,
            IConfiguration configuration,
            ILogger<AuthenticationService> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenService = jwtTokenService;
            _refreshTokenRepository = refreshTokenRepository;
            _configuration = configuration;
            _logger = logger;
            _refreshTokenExpirationDays = _configuration.GetValue<int>("JwtSettings:RefreshTokenExpirationDays", 7);
        }

        public async Task<Result<AuthResponse>> LoginAsync(LoginRequest request)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    return Result<AuthResponse>.Failure("Invalid email or password.");
                }

                if (!user.IsActive)
                {
                    return Result<AuthResponse>.Failure("Account is deactivated.");
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
                
                if (!result.Succeeded)
                {
                    if (result.IsLockedOut)
                    {
                        return Result<AuthResponse>.Failure("Account is locked out.");
                    }
                    if (result.IsNotAllowed)
                    {
                        return Result<AuthResponse>.Failure("Account is not allowed to sign in.");
                    }
                    return Result<AuthResponse>.Failure("Invalid email or password.");
                }

                // Update last login
                user.LastLoginAt = DateTime.UtcNow;
                await _userManager.UpdateAsync(user);

                // Generate tokens
                var authResponse = await GenerateTokensAsync(user);

                _logger.LogInformation("User {Email} logged in successfully", request.Email);
                return Result<AuthResponse>.Success(authResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for {Email}", request.Email);
                return Result<AuthResponse>.Failure("An error occurred during login.");
            }
        }

        public async Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return Result<AuthResponse>.Failure("User with this email already exists.");
                }

                // Create new user
                var user = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    EmailConfirmed = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    Status = Domain.Enums.Identity.UserStatus.Active
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return Result<AuthResponse>.Failure($"Registration failed: {errors}");
                }

                // Add default role
                await _userManager.AddToRoleAsync(user, "User");

                // Generate tokens
                var authResponse = await GenerateTokensAsync(user);

                _logger.LogInformation("User {Email} registered successfully", request.Email);
                return Result<AuthResponse>.Success(authResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for {Email}", request.Email);
                return Result<AuthResponse>.Failure("An error occurred during registration.");
            }
        }

        public async Task<Result<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request)
        {
            try
            {
                // Validate the access token (even if expired)
                var principal = _jwtTokenService.ValidateExpiredToken(request.AccessToken);
                if (principal == null)
                {
                    return Result<AuthResponse>.Failure("Invalid access token.");
                }

                var userIdClaim = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return Result<AuthResponse>.Failure("Invalid token claims.");
                }

                // Get the refresh token from database
                var refreshToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken);
                if (refreshToken == null || !refreshToken.IsActive || refreshToken.UserId != userId)
                {
                    return Result<AuthResponse>.Failure("Invalid refresh token.");
                }

                // Get the user
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null || !user.IsActive)
                {
                    return Result<AuthResponse>.Failure("User not found or inactive.");
                }

                // Revoke the old refresh token
                refreshToken.IsRevoked = true;
                refreshToken.RevokedAt = DateTime.UtcNow;
                refreshToken.RevokedReason = "Replaced by new token";
                await _refreshTokenRepository.UpdateAsync(refreshToken);

                // Generate new tokens
                var authResponse = await GenerateTokensAsync(user);
                
                // Set the replaced token reference
                var newRefreshToken = await _refreshTokenRepository.GetByTokenAsync(authResponse.RefreshToken);
                if (newRefreshToken != null)
                {
                    refreshToken.ReplacedByToken = newRefreshToken.Token;
                    await _refreshTokenRepository.UpdateAsync(refreshToken);
                }

                _logger.LogInformation("Tokens refreshed for user {UserId}", userId);
                return Result<AuthResponse>.Success(authResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return Result<AuthResponse>.Failure("An error occurred during token refresh.");
            }
        }

        public async Task<Result> LogoutAsync(string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    return Result.Failure("User ID is required.");
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return Result.Failure("User not found.");
                }

                // Sign out the user
                await _signInManager.SignOutAsync();

                // Revoke all refresh tokens for this user
                await _refreshTokenRepository.RevokeAllUserTokensAsync(Guid.Parse(userId));

                _logger.LogInformation("User {UserId} logged out successfully", userId);
                return Result.Success();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout for user {UserId}", userId);
                return Result.Failure("An error occurred during logout.");
            }
        }

        public async Task<Result> RevokeTokenAsync(string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token))
                {
                    return Result.Failure("Token is required.");
                }

                await _refreshTokenRepository.RevokeTokenAsync(token);

                _logger.LogInformation("Token revoked successfully");
                return Result.Success();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token revocation");
                return Result.Failure("An error occurred during token revocation.");
            }
        }

        public async Task<Result> RevokeAllUserTokensAsync(string userId)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    return Result.Failure("User ID is required.");
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return Result.Failure("User not found.");
                }

                // Revoke all refresh tokens for this user
                await _refreshTokenRepository.RevokeAllUserTokensAsync(Guid.Parse(userId));

                // Update security stamp to invalidate existing tokens
                await _userManager.UpdateSecurityStampAsync(user);

                _logger.LogInformation("All tokens revoked for user {UserId}", userId);
                return Result.Success();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token revocation for user {UserId}", userId);
                return Result.Failure("An error occurred during token revocation.");
            }
        }

        public async Task<Result<AuthResponse>> ConfirmEmailAsync(ConfirmEmailRequest request)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    return Result<AuthResponse>.Failure("User not found.");
                }

                var result = await _userManager.ConfirmEmailAsync(user, request.Token);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return Result<AuthResponse>.Failure($"Email confirmation failed: {errors}");
                }

                // Generate tokens after email confirmation
                var authResponse = await GenerateTokensAsync(user);

                _logger.LogInformation("Email confirmed for user {Email}", user.Email);
                return Result<AuthResponse>.Success(authResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during email confirmation for user {Email}", request.Email);
                return Result<AuthResponse>.Failure("An error occurred during email confirmation.");
            }
        }

        public async Task<Result> ResendEmailConfirmationAsync(string email)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    // Don't reveal that the user doesn't exist for security reasons
                    return Result.Success();
                }

                if (user.EmailConfirmed)
                {
                    return Result.Failure("Email is already confirmed.");
                }

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                
                // For now, just log the token (in production, you'd send an email)
                _logger.LogInformation("Email confirmation token for {Email}: {Token}", email, token);

                return Result.Success();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during email confirmation resend for {Email}", email);
                return Result.Failure("An error occurred while sending confirmation email.");
            }
        }

        private async Task<AuthResponse> GenerateTokensAsync(ApplicationUser user)
        {
            // Get user roles
            var roles = await _userManager.GetRolesAsync(user);

            // Generate access token
            var accessToken = _jwtTokenService.GenerateAccessToken(
                user.Id, 
                user.Email!, 
                $"{user.FirstName} {user.LastName}".Trim(), 
                roles);

            // Generate and store refresh token
            var refreshTokenValue = _jwtTokenService.GenerateRefreshToken();
            var refreshToken = new RefreshToken
            {
                Id = Guid.NewGuid(),
                Token = refreshTokenValue,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(_refreshTokenExpirationDays),
                CreatedAt = DateTime.UtcNow
            };

            await _refreshTokenRepository.AddAsync(refreshToken);

            var expiresAt = DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("JwtSettings:AccessTokenExpirationMinutes", 60));

            return new AuthResponse
            {
                Success = true,
                Message = "Authentication successful",
                Token = accessToken,
                RefreshToken = refreshTokenValue,
                ExpiresAt = expiresAt,
                User = new UserDto
                {
                    Id = user.Id.ToString(),
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    IsEmailConfirmed = user.EmailConfirmed,
                    IsActive = user.IsActive,
                    ProfileImageUrl = user.ProfileImageUrl,
                    Roles = roles.ToList(),
                    CreatedAt = user.CreatedAt
                }
            };
        }
    }
}
