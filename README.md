# Community Car Platform

A comprehensive social platform for car enthusiasts featuring AI-powered assistance, community engagement, and automotive insights.

## 🚗 Overview

Community Car combines social networking with intelligent automotive assistance, providing car enthusiasts with:

- **AI-Powered Recommendations**: Smart car suggestions based on preferences and budget
- **Community Features**: Posts, groups, friends, and reviews
- **Maintenance Intelligence**: AI-driven maintenance scheduling and advice
- **Market Analysis**: Real-time pricing and investment insights
- **Admin Dashboard**: Comprehensive content moderation and user management

## 🏗️ Architecture

### Backend (.NET 8)
- **Clean Architecture** with Domain, Application, Infrastructure, and WebAPI layers
- **CQRS Pattern** using MediatR for command/query separation
- **Entity Framework Core** for data access
- **JWT Authentication** with role-based authorization
- **SignalR** for real-time features

### AI Agent (Python/FastAPI)
- **HuggingFace Transformers** for natural language processing
- **FastAPI** for high-performance API endpoints
- **Redis** for caching and session management
- **Docker** containerization for easy deployment

### Frontend (Angular 19)
- **Angular Material** for modern UI components
- **TypeScript** for type-safe development
- **RxJS** for reactive programming
- **SCSS** for enhanced styling

## 🚀 Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- Python 3.11+
- SQL Server or SQL Server Express
- Redis (optional, for AI agent caching)

### Automated Setup (Windows)
```powershell
# Run the automated startup script
.\start-system.ps1
```

### Manual Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd community-car
```

2. **Setup Database**
```bash
# Update connection string in src/WebAPI/appsettings.json
# Run migrations
dotnet ef database update --project src/Infrastructure --startup-project src/WebAPI
```

3. **Start Backend API**
```bash
dotnet run --project src/WebAPI
# API will be available at http://localhost:5000
```

4. **Start AI Agent**
```bash
cd ai-agent
pip install -r requirements.txt
python start.py
# AI service will be available at http://localhost:8000
```

5. **Start Frontend**
```bash
cd ClientApp
npm install
npm start
# App will be available at http://localhost:4200
```

## 📁 Project Structure

```
community-car/
├── src/                          # .NET Backend
│   ├── Domain/                   # Domain entities and business logic
│   ├── Application/              # Application services and CQRS
│   ├── Infrastructure/           # Data access and external services
│   └── WebAPI/                   # API controllers and configuration
├── ClientApp/                    # Angular Frontend
│   └── src/app/
│       ├── core/                 # Core services and guards
│       └── features/             # Feature modules
├── ai-agent/                     # Python AI Service
│   ├── app/
│   │   ├── api/routes/          # FastAPI route handlers
│   │   ├── core/                # AI services and configuration
│   │   └── models/              # Pydantic schemas
│   └── requirements.txt
└── start-system.ps1             # Automated startup script
```

## 🔧 Development

### Backend Development
```bash
# Build solution
dotnet build

# Run tests
dotnet test

# Create migration
dotnet ef migrations add <MigrationName> --project src/Infrastructure --startup-project src/WebAPI

# Update database
dotnet ef database update --project src/Infrastructure --startup-project src/WebAPI
```

### Frontend Development
```bash
cd ClientApp

# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### AI Agent Development
```bash
cd ai-agent

# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Build Docker image
docker build -t community-car-ai .
```

## 🔐 Authentication & Authorization

### User Roles
- **User**: Basic community member
- **Moderator**: Content moderation capabilities
- **Admin**: Full system administration

### Admin Features
- User management (suspend, activate, delete)
- Content moderation (approve, reject posts)
- System monitoring and analytics
- Community oversight tools

### API Security
- JWT token-based authentication
- Role-based authorization policies
- CORS configuration for frontend integration
- Request logging and monitoring

## 🤖 AI Features

### Chat Assistant
- Natural language conversations about cars
- Context-aware responses
- Integration with user preferences

### Car Recommendations
- Personalized suggestions based on budget and preferences
- Comparison tools for multiple vehicles
- Budget analysis and optimization

### Maintenance Intelligence
- Smart scheduling based on mileage and time
- Cost estimation for services
- Troubleshooting guidance
- Preventive maintenance alerts

### Market Analysis
- Real-time pricing trends
- Investment potential analysis
- Depreciation forecasting
- Market timing recommendations

## 📊 API Documentation

### Backend API
- Swagger UI: `http://localhost:5000/swagger`
- OpenAPI specification available
- Comprehensive endpoint documentation

### AI Agent API
- FastAPI docs: `http://localhost:8000/docs`
- Interactive API testing
- Schema definitions and examples

## 🐳 Deployment

### Docker Deployment
```bash
# AI Agent with Docker Compose
cd ai-agent
docker-compose up -d

# Scale AI service
docker-compose up --scale ai-agent=3
```

### Production Configuration
- Configure production database connection strings
- Set up proper JWT secrets and keys
- Configure CORS for production domains
- Set up Redis cluster for AI agent caching
- Implement proper logging and monitoring

## 🔍 Monitoring & Health Checks

- Health endpoints for all services
- Structured logging with correlation IDs
- Performance monitoring and metrics
- Error tracking and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the established coding patterns
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation in each service directory
- Review the API documentation
- Check existing issues in the repository
- Create a new issue with detailed information

---

**Community Car Platform** - Connecting car enthusiasts with intelligent automotive insights.