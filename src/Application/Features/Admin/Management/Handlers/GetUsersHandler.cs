using Application.Common.Models;
using Application.Features.Admin.Management.DTOs.Responses;
using Application.Features.Admin.Management.Models;
using Application.Features.Admin.Management.Queries;
using MediatR;

namespace Application.Features.Admin.Management.Handlers
{
    public class GetUsersHandler : IRequestHandler<GetUsersQuery, Result<PaginatedList<AdminUserResponse>>>
    {
        public async Task<Result<PaginatedList<AdminUserResponse>>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // TODO: Implement actual user retrieval logic
                var users = new List<AdminUserResponse>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        FirstName = "John",
                        LastName = "Doe",
                        Email = "john.doe@example.com",
                        Status = "Active",
                        IsActive = true,
                        JoinDate = DateTime.UtcNow.AddDays(-30),
                        LastLogin = DateTime.UtcNow.AddHours(-2),
                        PostsCount = 45,
                        GroupsCount = 3,
                        ReviewsCount = 12,
                        Roles = new List<string> { "User" },
                        UserStatus = Domain.Enums.Identity.UserStatus.Active
                    },
                    new()
                    {
                        Id = Guid.NewGuid(),
                        FirstName = "Jane",
                        LastName = "Smith",
                        Email = "jane.smith@example.com",
                        Status = "Active",
                        IsActive = true,
                        JoinDate = DateTime.UtcNow.AddDays(-15),
                        LastLogin = DateTime.UtcNow.AddMinutes(-30),
                        PostsCount = 23,
                        GroupsCount = 2,
                        ReviewsCount = 8,
                        Roles = new List<string> { "User", "Moderator" },
                        UserStatus = Domain.Enums.Identity.UserStatus.Active
                    }
                };

                var paginatedUsers = new PaginatedList<AdminUserResponse>(
                    users.Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToList(),
                    users.Count,
                    request.Page,
                    request.PageSize
                );

                return Result<PaginatedList<AdminUserResponse>>.Success(paginatedUsers);
            }
            catch (Exception ex)
            {
                return Result<PaginatedList<AdminUserResponse>>.Failure($"Error retrieving users: {ex.Message}");
            }
        }
    }
}