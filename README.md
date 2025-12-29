# Community Car - Social Platform

A comprehensive social platform for car enthusiasts with AI-powered features.

## Architecture

This project follows Clean Architecture principles with 4 main layers:

### 🏗️ Domain Layer (`src/Domain/`)
- **Base**: Base entities and audit functionality
- **Entities**: Core business entities (User, Post, Group, Review, etc.)
- **Enums**: Domain enumerations
- **DomainEvents**: Domain event definitions
- **Specifications**: Query specifications pattern
- **Interfaces**: Domain service contracts
- **Exceptions**: Domain-specific exceptions
- **Rules**: Business rules validation
- **Policies**: Authorization policies

### 🔧 Infrastructure Layer (`src/Infrastructure/`)
- **Data**: Entity Framework DbContext and configurations
- **Identity**: ASP.NET Core Identity setup
- **Repositories**: Data access implementations
- **Configurations**: Entity configurations
- **Seeds**: Database seeding
- **Migrations**: EF Core migrations
- **Interceptors**: EF interceptors
- **Caching**: Caching implementations
- **Logging**: Logging services
- **Security**: Security implementations
- **Monitoring**: Application monitoring
- **Integration**: External service integrations
- **BackgroundJobs**: Background task processing
- **Services**: Infrastructure service implementations

### 📋 Application Layer (`src/Application/`)
- **Common**: Shared interfaces, models, behaviors, exceptions, mappings
- **Features**: Feature-based organization with DTOs, Commands, and Queries
  - **DTOs**: Request/Response models
  - **Commands**: Write operations (CQRS)
  - **Queries**: Read operations (CQRS)

### 🌐 WebAPI Layer (`src/WebAPI/`)
- **Controllers**: 
  - **Admin**: Administrative endpoints
  - **Community**: Community features
  - **Identity**: Authentication & authorization
  - **Shared**: Shared functionality (localization, etc.)
- **Filters**: Action filters and exception handling
- **Middleware**: Custom middleware components
- **Extensions**: Service registration extensions
- **Hubs**: SignalR hubs
- **Configuration**: API configuration models

## Features

### 🤖 AI Agent (`src/Features/AIAgent/`)
- AI-powered chat assistant
- Car recommendations
- Maintenance scheduling
- Price analysis
- Community insights

### 🅰️ Angular Client (`ClientApp/`)
- Angular 19 application
- Material Design UI
- Responsive design
- Feature-based modules
- Lazy loading

## Key Features

- **Social Community**: Posts, groups, friends, reviews
- **Car Management**: Car profiles, maintenance tracking
- **AI Assistant**: Intelligent recommendations and chat
- **Admin Dashboard**: Content moderation and management
- **Multi-language Support**: Localization system
- **Real-time Features**: SignalR integration
- **Security**: JWT authentication, role-based authorization

## Technology Stack

### Backend
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- MediatR (CQRS)
- FluentValidation
- AutoMapper
- SignalR
- JWT Authentication

### Frontend
- Angular 19
- Angular Material
- RxJS
- TypeScript
- SCSS

### Database
- SQL Server
- Entity Framework Core

## Getting Started

1. **Clone the repository**
2. **Setup Database**: Update connection string in `appsettings.json`
3. **Run Migrations**: `dotnet ef database update`
4. **Start API**: `dotnet run --project src/WebAPI`
5. **Start Client**: `cd ClientApp && npm install && npm start`

## Project Structure

```
├── src/
│   ├── Domain/           # Core business logic
│   ├── Application/      # Application services
│   ├── Infrastructure/   # Data access & external services
│   ├── WebAPI/          # API controllers & configuration
│   └── Features/        # Feature-specific implementations
├── ClientApp/           # Angular application
└── CommunityCar.sln    # Solution file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.