using Application.Common.Models;
using Application.Features.Admin.DTOs.System;
using MediatR;

namespace Application.Features.Admin.Queries.System
{
    public class GetSystemHealthQuery : IRequest<Result<SystemHealthDto>>
    {
    }
}