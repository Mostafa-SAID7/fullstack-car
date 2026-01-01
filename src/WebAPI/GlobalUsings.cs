// System namespaces
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading;
global using System.Threading.Tasks;
global using System.ComponentModel.DataAnnotations;
global using System.Security.Claims;

// Microsoft namespaces
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using Microsoft.Extensions.Logging;
global using Microsoft.Extensions.Configuration;
global using Microsoft.Extensions.DependencyInjection;

// MediatR
global using MediatR;

// Application
global using Application.Common.Models;
global using Application.Features.Admin.Analytics.Queries;
global using Application.Features.Admin.Analytics.Commands;
global using Application.Features.Admin.Analytics.DTOs.Requests;
global using Application.Features.Admin.Analytics.DTOs.Responses;
global using Application.Features.Admin.Dashboard.Queries;
global using Application.Features.Admin.Management.Queries;
global using Application.Features.Admin.Management.Commands;
global using Application.Features.Identity.Auth.Commands;
global using Application.Features.Identity.Profile.Commands;
global using Application.Features.Identity.Profile.Queries;
global using Application.Features.Community.Posts.Commands;
global using Application.Features.Community.Posts.Queries;
global using Application.Features.Shared.Logging.Extensions;
global using Application.Features.Shared.Storage.Models;