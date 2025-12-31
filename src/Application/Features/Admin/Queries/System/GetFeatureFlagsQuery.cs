using Application.Common.Models;
using Application.Features.Admin.DTOs.System;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetFeatureFlagsQuery : IRequest<Result<List<FeatureFlagDto>>>
    {
        public string? Environment { get; set; }
        public bool? IsEnabled { get; set; }
    }
}