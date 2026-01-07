using Application.Features.Identity.Auth.Interfaces;
using Application.Features.Identity.Core.Interfaces;
using Application.Common.Models;
using Application.Features.Identity.Auth.DTOs.Requests;
using Application.Features.Identity.Auth.DTOs.Responses;
using Application.Features.Identity.Profile.DTOs.Responses;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Application.Features.Identity.Auth.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly ILogger<AuthenticationService> _logger;

        public AuthenticationService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IJwtTokenService jwtTokenService,
            ILogger<AuthenticationService> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenService = jwtTokenService;
            _logger = logger;
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

                // Get user roles
                var roles = await _userManager.GetRolesAsync(user);

                // Generate tokens
                var accessToken = _jwtTokenService.GenerateAccessToken(
                    user.Id, 
                    user.Email!, 
                    $"{user.FirstName} {user.LastName}".Trim(), 
                    roles);
                
                var refreshToken = _jwtTokenService.GenerateRefreshToken();
                var expiresAt = DateTime.UtcNow.AddMinutes(60); // Default 60 minutes

                // TODO: Store refresh token in database
                // For now, we'll just return it

                var response = new AuthResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = accessToken,
                    RefreshToken = refreshToken,
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

                _logger.LogInformation("User {Email} logged in successfully", request.Email);
                return Result<AuthResponse>.Success(response);
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
                var roles = await _userManager.GetRolesAsync(user);
                var accessToken = _jwtTokenService.GenerateAccessToken(
                    user.Id, 
                    user.Email!, 
                    $"{user.FirstName} {user.LastName}".Trim(), 
                    roles);
                
                var refreshToken = _jwtTokenService.GenerateRefreshToken();
                var expiresAt = DateTime.UtcNow.AddMinutes(60);

                var response = new AuthResponse
                {
                    Success = true,
                    Message = "Registration successful",
                    Token = accessToken,
                    RefreshToken = refreshToken,
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

                _logger.LogInformation("User {Email} registered successfully", request.Email);
                return Result<AuthResponse>.Success(response);
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
                // TODO: In a real implementation, you would:
                // 1. Validate the refresh token from database
                // 2. Check if it's not expired or revoked
                // 3. Get the user associated with the token
                
                // For now, we'll implement a basic version
                if (string.IsNullOrEmpty(request.RefreshToken))
                {
                    return Result<AuthResponse>.Failure("Invalid refresh token.");
                }

                // In a real scenario, you'd decode the refresh token to get user info
                // For now, we'll return an error since we don't have token storage implemented
                return Result<AuthResponse>.Failure("Refresh token functionality not fully implemented. Please login again.");
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

                // TODO: In a real implementation, you would:
                // 1. Revoke all refresh tokens for this user
                // 2. Add the current JWT to a blacklist
                // 3. Clear any cached user sessions

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

                // TODO: In a real implementation, you would:
                // 1. Add the token to a blacklist/revoked tokens table
                // 2. Validate the token format and signature
                // 3. Update the database to mark the token as revoked

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

                // TODO: In a real implementation, you would:
                // 1. Revoke all refresh tokens for this user from database
                // 2. Add all active JWTs for this user to blacklist
                // 3. Update user's security stamp to invalidate existing tokens

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
                var roles = await _userManager.GetRolesAsync(user);
                var accessToken = _jwtTokenService.GenerateAccessToken(
                    user.Id, 
                    user.Email!, 
                    $"{user.FirstName} {user.LastName}".Trim(), 
                    roles);
                
                var refreshToken = _jwtTokenService.GenerateRefreshToken();
                var expiresAt = DateTime.UtcNow.AddMinutes(60);

                var response = new AuthResponse
                {
                    Success = true,
                    Message = "Email confirmed successfully",
                    Token = accessToken,
                    RefreshToken = refreshToken,
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

                _logger.LogInformation("Email confirmed for user {Email}", user.Email);
                return Result<AuthResponse>.Success(response);
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

                // TODO: In a real implementation, you would:
                // 1. Generate email confirmation token
                // 2. Send confirmation email with the token
                // 3. Use an email service to send the email

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
    }
}
