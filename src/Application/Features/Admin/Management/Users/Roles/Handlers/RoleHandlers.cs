using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Admin.Management.Users.Roles.Commands;
using Application.Features.Admin.Management.Users.Roles.DTOs.Responses;
using Application.Features.Admin.Management.Users.Roles.Queries;
using Application.Features.Admin.Management.Users.Users.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Admin.Management.Users.Roles.Handlers;

public class GetRolesHandler : IRequestHandler<GetRolesQuery, Result<PaginatedList<RoleResponse>>>
{
    private readonly IApplicationDbContext _context;

    public GetRolesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<RoleResponse>>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            // Mock implementation - return sample roles
            var roles = new List<RoleResponse>
            {
                new() 
                { 
                    Id = Guid.NewGuid(), 
                    Name = "Admin", 
                    Description = "Administrator role", 
                    Priority = 1, 
                    IsSystemRole = true, 
                    IsActive = true, 
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    CreatedBy = "System",
                    Permissions = new List<string> { "Users.Read", "Users.Write", "Products.Read", "Products.Write" },
                    UserCount = 2
                },
                new() 
                { 
                    Id = Guid.NewGuid(), 
                    Name = "User", 
                    Description = "Regular user role", 
                    Priority = 10, 
                    IsSystemRole = true, 
                    IsActive = true, 
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    CreatedBy = "System",
                    Permissions = new List<string> { "Products.Read" },
                    UserCount = 48
                }
            };

            if (!string.IsNullOrEmpty(request.SearchTerm))
            {
                roles = roles.Where(r => r.Name.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                                        r.Description.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            if (request.IsSystemRole.HasValue)
            {
                roles = roles.Where(r => r.IsSystemRole == request.IsSystemRole.Value).ToList();
            }

            var totalCount = roles.Count;
            var pagedRoles = roles.Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToList();

            var result = new PaginatedList<RoleResponse>(pagedRoles, totalCount, request.Page, request.PageSize);
            return Result<PaginatedList<RoleResponse>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PaginatedList<RoleResponse>>.Failure($"Error getting roles: {ex.Message}");
        }
    }
}

public class GetRoleByIdHandler : IRequestHandler<GetRoleByIdQuery, Result<RoleResponse>>
{
    private readonly IApplicationDbContext _context;

    public GetRoleByIdHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<RoleResponse>> Handle(GetRoleByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var role = new RoleResponse
            {
                Id = request.RoleId,
                Name = "Admin",
                Description = "Administrator role",
                Priority = 1,
                IsSystemRole = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                CreatedBy = "System",
                Permissions = new List<string> { "Users.Read", "Users.Write", "Products.Read", "Products.Write" },
                UserCount = 2
            };

            return Result<RoleResponse>.Success(role);
        }
        catch (Exception ex)
        {
            return Result<RoleResponse>.Failure($"Error getting role: {ex.Message}");
        }
    }
}

public class GetRoleUsersHandler : IRequestHandler<GetRoleUsersQuery, Result<PaginatedList<AdminUser>>>
{
    private readonly IApplicationDbContext _context;

    public GetRoleUsersHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<AdminUser>>> Handle(GetRoleUsersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var users = new List<AdminUser>
            {
                new() 
                { 
                    Id = Guid.NewGuid(), 
                    Email = "admin@example.com", 
                    FirstName = "Admin", 
                    LastName = "User", 
                    IsActive = true, 
                    JoinDate = DateTime.UtcNow.AddDays(-30) 
                }
            };

            var result = new PaginatedList<AdminUser>(users, users.Count, request.Page, request.PageSize);
            return Result<PaginatedList<AdminUser>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PaginatedList<AdminUser>>.Failure($"Error getting role users: {ex.Message}");
        }
    }
}
