using Application.Common.Models;
using Application.Features.Admin.DTOs.System;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetSystemConfigurationQuery : IRequest<Result<SystemConfigurationDto>>
    {
    }
}