using Application.Common.Models;
using Application.Features.Filters.Related.DTOs.Responses;
using Domain.Enums.Common;
using MediatR;

namespace Application.Features.Filters.Related.Queries;

public class GetRelatedContentQuery : IRequest<Result<RelatedContentResponse>>
{
    public Guid ContentId { get; set; }
    public ContentType ContentType { get; set; }
    public int Limit { get; set; } = 5;
    public string Algorithm { get; set; } = "similarity"; // similarity, tags, category, user_behavior
    public bool IncludeSameAuthor { get; set; } = false;
}