// System namespaces
global using System;
global using System.Collections.Generic;
global using System.ComponentModel.DataAnnotations;
global using System.ComponentModel.DataAnnotations.Schema;

// Domain Base
global using Domain.Base;
global using Domain.Interfaces;
global using Domain.Exceptions;
global using Domain.Rules;
global using Domain.DomainEvents;

// Domain ValueObjects
global using Domain.ValueObjects.Identity;
global using Domain.ValueObjects.Community.Posts;
global using Domain.ValueObjects.Community.Groups;
global using Domain.ValueObjects.Admin;
global using Domain.ValueObjects.Shared;

// Domain Enums
global using Domain.Enums.Community.Notifications;
global using Domain.Enums.Shared;
global using Domain.Enums.Admin.Dashboard;
global using Domain.Enums.Marketplace;
global using Domain.Enums.Admin.Moderation;
global using Domain.Enums.Admin.System;
