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

        public Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request)
        {
            throw new NotImplementedException("AuthenticationService.RegisterAsync needs implementation");
        }

        public Task<Result<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request)
        {
            throw new NotImplementedException("AuthenticationService.RefreshTokenAsync needs implementation");
        }

        public Task<Result> LogoutAsync(string userId)
        {
            throw new NotImplementedException("AuthenticationService.LogoutAsync needs implementation");
        }

        public Task<Result> RevokeTokenAsync(string token)
        {
            throw new NotImplementedException("AuthenticationService.RevokeTokenAsync needs implementation");
        }

        public Task<Result> RevokeAllUserTokensAsync(string userId)
        {
            throw new NotImplementedException("AuthenticationService.RevokeAllUserTokensAsync needs implementation");
        }

        public Task<Result<AuthResponse>> ConfirmEmailAsync(ConfirmEmailRequest request)
        {
            throw new NotImplementedException("AuthenticationService.ConfirmEmailAsync needs implementation");
        }

        public Task<Result> ResendEmailConfirmationAsync(string email)
        {
            throw new NotImplementedException("AuthenticationService.ResendEmailConfirmationAsync needs implementation");
        }
    }
}
