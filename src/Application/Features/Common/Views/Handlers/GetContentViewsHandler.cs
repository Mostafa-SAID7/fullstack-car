using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Features.Common.Views.DTOs.Responses;
using Application.Features.Common.Views.Queries;
using Domain.Enums.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Common.Views.Handlers;

public class GetContentViewsHandler : IRequestHandler<GetContentViewsQuery, Result<PaginatedList<ViewResponse>>>
{
    private readonly IApplicationDbContext _context;

    public GetContentViewsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<ViewResponse>>> Handle(GetContentViewsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Views
                .Where(v => v.ContentId == request.ContentId && v.ContentType == request.ContentType)
                .OrderByDescending(v => v.CreatedAt);

            var totalCount = await query.CountAsync(cancellationToken);
            var views = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var viewResponses = views.Select(v => new ViewResponse
            {
                Id = v.Id,
                ContentId = v.ContentId,
                ContentType = v.ContentType,
                UserId = v.UserId,
                IpAddress = v.IpAddress,
                UserAgent = v.UserAgent,
                CreatedAt = v.CreatedAt,
                ContentTitle = GetContentTitle(v.ContentId, v.ContentType),
                ContentUrl = GetContentUrl(v.ContentId, v.ContentType),
                UserName = GetUserName(v.UserId)
            }).ToList();

            var result = new PaginatedList<ViewResponse>(viewResponses, totalCount, request.Page, request.PageSize);
            return Result<PaginatedList<ViewResponse>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PaginatedList<ViewResponse>>.Failure($"Failed to retrieve content views: {ex.Message}");
        }
    }

    private string GetContentTitle(Guid contentId, ContentType contentType)
    {
        // This would need to be implemented based on the content type
        // For now, return a placeholder
        return $"{contentType} Content";
    }

    private string GetContentUrl(Guid contentId, ContentType contentType)
    {
        // This would need to be implemented based on the content type
        // For now, return a placeholder
        return $"/{contentType.ToString().ToLower()}/{contentId}";
    }

    private string? GetUserName(Guid? userId)
    {
        if (!userId.HasValue) return null;
        
        // This would need to be implemented to get the actual user name
        // For now, return a placeholder
        return "User";
    }
}