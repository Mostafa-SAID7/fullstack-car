// System namespaces
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading;
global using System.Threading.Tasks;
global using System.ComponentModel.DataAnnotations;
global using System.Text.Json.Serialization;

// Microsoft namespaces
global using Microsoft.Extensions.Logging;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.AspNetCore.Http;
global using Microsoft.AspNetCore.Identity;
global using Microsoft.Extensions.Caching.Memory;
global using Microsoft.Extensions.Caching.Distributed;

// MediatR
global using MediatR;

// AutoMapper
global using AutoMapper;

// FluentValidation
global using FluentValidation;

// Application Common
global using Application.Common.Models;
global using Application.Common.Interfaces.Data;
global using Application.Features.Shared.Logging.Interfaces;
global using Application.Features.Admin.Analytics.Interfaces;
global using Application.Features.Identity.Core.Interfaces;
global using Application.Features.Identity.Auth.Interfaces;
global using Application.Features.Shared.Caching.Interfaces.Services;
global using Application.Features.Shared.Caching.Interfaces;
global using Application.Features.Shared.Caching.DTOs.Requests;
global using Application.Features.Shared.Caching.DTOs.Responses;
global using Application.Features.Shared.Caching.Models;
global using Application.Features.Shared.Caching.Services;
global using Application.Features.Shared.Security.Interfaces;
global using Application.Features.Shared.Security.Models;
global using Application.Features.Shared.System.Interfaces;
global using Application.Features.Shared.System.Models;

// Domain
global using Domain.Entities.Identity;
global using Domain.Entities.Community.Posts;
global using Domain.Entities.Community.Groups;
global using Domain.Entities.Marketplace.Services;
global using Domain.Entities.Marketplace.Providers;
global using Domain.Entities.Marketplace.Bookings;
global using Domain.Entities.Shared.Chat;
