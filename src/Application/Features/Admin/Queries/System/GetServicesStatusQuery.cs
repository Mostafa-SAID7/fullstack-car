using Application.Common.Models;
using Application.Features.Admin.DTOs.System;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetServicesStatusQuery : IRequest<Result<List<ServiceStatusDto>>>
    {
    }
}