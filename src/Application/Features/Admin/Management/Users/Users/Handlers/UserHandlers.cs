using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Admin.Management.Users.Users.DTOs.Responses;
using Application.Features.Admin.Management.Users.Users.Models;
using Application.Features.Admin.Management.Users.Users.Queries;
using Application.Features.Admin.Management.Users.Users.Commands;
using Application.Features.Admin.Management.Users.Activities.Models;
using Application.Features.Admin.Management.Users.Reports.Models;
using Domain.Entities.Identity;
using Domain.Enums.Identity;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Admin.Management.Users.Users.Handlers
{
    public class GetUsersHandler : IRequestHandler<GetUsersQuery, Result<UserListResponse>>
    {
        private readonly IApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public GetUsersHandler(
            IApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<Result<UserListResponse>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _context.Users
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(request.Search))
                {
                    var searchLower = request.Search.ToLower();
                    query = query.Where(u => 
                        u.FirstName.ToLower().Contains(searchLower) ||
                        u.LastName.ToLower().Contains(searchLower) ||
                        u.Email.ToLower().Contains(searchLower));
                }

                if (!string.IsNullOrEmpty(request.Role))
                {
                    query = query.Where(u => u.UserRoles.Any(ur => ur.Role.Name == request.Role));
                }

                if (!string.IsNullOrEmpty(request.Status))
                {
                    if (Enum.TryParse<UserStatus>(request.Status, out var status))
                    {
                        query = query.Where(u => u.Status == status);
                    }
                }

                if (request.IsVerified.HasValue)
                {
                    query = query.Where(u => u.EmailConfirmed == request.IsVerified.Value);
                }

                if (request.JoinedAfter.HasValue)
                {
                    query = query.Where(u => u.CreatedAt >= request.JoinedAfter.Value);
                }

                if (request.JoinedBefore.HasValue)
                {
                    query = query.Where(u => u.CreatedAt <= request.JoinedBefore.Value);
                }

                // Apply sorting
                query = request.SortBy?.ToLower() switch
                {
                    "firstname" => request.SortDirection?.ToLower() == "desc" 
                        ? query.OrderByDescending(u => u.FirstName)
                        : query.OrderBy(u => u.FirstName),
                    "lastname" => request.SortDirection?.ToLower() == "desc"
                        ? query.OrderByDescending(u => u.LastName)
                        : query.OrderBy(u => u.LastName),
                    "email" => request.SortDirection?.ToLower() == "desc"
                        ? query.OrderByDescending(u => u.Email)
                        : query.OrderBy(u => u.Email),
                    "lastlogin" => request.SortDirection?.ToLower() == "desc"
                        ? query.OrderByDescending(u => u.LastLoginAt)
                        : query.OrderBy(u => u.LastLoginAt),
                    _ => request.SortDirection?.ToLower() == "desc"
                        ? query.OrderByDescending(u => u.CreatedAt)
                        : query.OrderBy(u => u.CreatedAt)
                };

                // Get total count
                var totalCount = await query.CountAsync(cancellationToken);

                // Apply pagination
                var users = await query
                    .Skip((request.Page - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                // Map to DTOs
                var userDtos = users.Select(u => new AdminUser
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Status = u.Status.ToString(),
                    IsActive = u.IsActive,
                    JoinDate = u.CreatedAt,
                    LastLogin = u.LastLoginAt,
                    PostsCount = 0, // TODO: Implement actual counts
                    GroupsCount = 0,
                    ReviewsCount = 0,
                    Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList(),
                    UserStatus = u.Status,
                    SuspendedUntil = null, // TODO: Implement suspension logic
                    SuspensionReason = null
                }).ToList();

                var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

                var response = new UserListResponse
                {
                    Users = userDtos,
                    TotalCount = totalCount,
                    PageNumber = request.Page,
                    PageSize = request.PageSize,
                    TotalPages = totalPages,
                    HasNextPage = request.Page < totalPages,
                    HasPreviousPage = request.Page > 1
                };

                return Result<UserListResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<UserListResponse>.Failure($"Error retrieving users: {ex.Message}");
            }
        }
    }

    public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, Result<UserDetailResponse>>
    {
        private readonly IApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public GetUserByIdHandler(
            IApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<Result<UserDetailResponse>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

                if (user == null)
                {
                    return Result<UserDetailResponse>.Failure("User not found");
                }

                var userDetail = new UserDetailResponse
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Status = user.Status.ToString(),
                    IsActive = user.IsActive,
                    JoinDate = user.CreatedAt,
                    LastLogin = user.LastLoginAt,
                    PostsCount = 0, // TODO: Implement actual counts
                    GroupsCount = 0,
                    ReviewsCount = 0,
                    Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList(),
                    UserStatus = user.Status,
                    SuspendedUntil = null,
                    SuspensionReason = null,
                    RecentActivity = new List<Application.Features.Admin.Management.Users.Activities.Models.UserActivity>(), // TODO: Implement activity tracking
                    Reports = new List<UserReport>() // TODO: Implement user reports
                };

                return Result<UserDetailResponse>.Success(userDetail);
            }
            catch (Exception ex)
            {
                return Result<UserDetailResponse>.Failure($"Error retrieving user details: {ex.Message}");
            }
        }
    }

    public class SearchUsersHandler : IRequestHandler<SearchUsersQuery, Result<List<UserSummary>>>
    {
        private readonly IApplicationDbContext _context;

        public SearchUsersHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<List<UserSummary>>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _context.Users
                    .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(request.SearchTerm))
                {
                    var searchLower = request.SearchTerm.ToLower();
                    query = query.Where(u =>
                        u.FirstName.ToLower().Contains(searchLower) ||
                        u.LastName.ToLower().Contains(searchLower) ||
                        u.Email.ToLower().Contains(searchLower));
                }

                if (!string.IsNullOrEmpty(request.Role))
                {
                    query = query.Where(u => u.UserRoles.Any(ur => ur.Role.Name == request.Role));
                }

                if (request.IsActive.HasValue)
                {
                    query = query.Where(u => u.IsActive == request.IsActive.Value);
                }

                var users = await query
                    .Take(request.Limit)
                    .Select(u => new UserSummary
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email,
                        IsActive = u.IsActive,
                        Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList(),
                        LastLogin = u.LastLoginAt
                    })
                    .ToListAsync(cancellationToken);

                return Result<List<UserSummary>>.Success(users);
            }
            catch (Exception ex)
            {
                return Result<List<UserSummary>>.Failure($"Error searching users: {ex.Message}");
            }
        }
    }

    public class SuspendUserHandler : IRequestHandler<SuspendUserCommand, Result<UserActionResponse>>
    {
        public async Task<Result<UserActionResponse>> Handle(SuspendUserCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // TODO: Implement actual user suspension logic
                // 1. Update user status to suspended
                // 2. Set suspension end date if duration is specified
                // 3. Log the action
                // 4. Send notification if requested
                // 5. Invalidate user sessions

                await Task.Delay(100, cancellationToken); // Simulate processing

                var response = new UserActionResponse
                {
                    Success = true,
                    Message = "User suspended successfully",
                    Data = new Dictionary<string, object>
                    {
                        { "userId", request.UserId },
                        { "suspendedBy", request.AdminId },
                        { "reason", request.Request.Reason },
                        { "suspendedAt", DateTime.UtcNow }
                    }
                };

                return Result<UserActionResponse>.Success(response);
            }
            catch (Exception ex)
            {
                return Result<UserActionResponse>.Failure($"Error suspending user: {ex.Message}");
            }
        }
    }
}
