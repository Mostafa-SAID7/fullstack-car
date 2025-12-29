# Community Car AI Agent

AI-powered assistant for the Community Car platform, providing intelligent car recommendations, maintenance advice, market analysis, and automotive insights using HuggingFace transformers.

## Features

- 🤖 **Intelligent Chat**: Natural language conversations about cars and automotive topics
- 🚗 **Car Recommendations**: Personalized suggestions based on preferences and budget
- 🔧 **Maintenance Advice**: Smart scheduling and troubleshooting guidance
- 📊 **Market Analysis**: Price trends, investment potential, and depreciation insights
- 🎯 **Context-Aware**: Integrates with Community Car platform for personalized responses

## Technology Stack

- **FastAPI**: Modern Python web framework
- **HuggingFace Transformers**: AI/ML models for natural language processing
- **PyTorch**: Deep learning framework
- **SQLAlchemy**: Database ORM
- **Redis**: Caching and session management
- **Docker**: Containerization and deployment

## Quick Start

### Prerequisites

- Python 3.11+
- Docker & Docker Compose (optional)
- Redis (for caching)

### Installation

1. **Clone and setup**:
```bash
cd ai-agent
cp .env.example .env
# Edit .env with your configuration
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Run the service**:
```bash
# Option 1: Direct Python
python start.py

# Option 2: Using uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Option 3: Using Docker Compose
docker-compose up --build
```

### Configuration

Edit `.env` file with your settings:

```env
# HuggingFace Configuration
HUGGINGFACE_API_KEY=your_api_key_here
MODEL_NAME=microsoft/DialoGPT-medium

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# External Services
COMMUNITY_CAR_API_URL=http://localhost:5000/api
REDIS_URL=redis://localhost:6379
```

## API Endpoints

### Chat Endpoints
- `POST /api/chat/` - General chat with AI assistant
- `POST /api/chat/context` - Chat with enhanced automotive context

### Recommendations
- `POST /api/recommendations/` - Get car recommendations
- `POST /api/recommendations/budget-analysis` - Budget-focused analysis
- `POST /api/recommendations/compare` - Compare multiple cars

### Maintenance
- `POST /api/maintenance/advice` - Get maintenance advice
- `POST /api/maintenance/schedule` - Create maintenance schedule
- `POST /api/maintenance/cost-estimate` - Estimate service costs
- `POST /api/maintenance/troubleshoot` - Troubleshoot car issues

### Analysis
- `POST /api/analysis/market` - Market trend analysis
- `POST /api/analysis/price` - Price valuation
- `POST /api/analysis/investment` - Investment potential
- `POST /api/analysis/depreciation` - Depreciation analysis

## Example Usage

### Chat with AI
```python
import httpx

response = httpx.post("http://localhost:8000/api/chat/", json={
    "message": "What's the best family SUV under $40,000?",
    "context": "Looking for reliability and safety"
})
```

### Get Car Recommendations
```python
response = httpx.post("http://localhost:8000/api/recommendations/", json={
    "budget": "$25,000 - $35,000",
    "car_type": "SUV",
    "fuel_type": "Hybrid",
    "usage": "Family driving"
})
```

### Maintenance Advice
```python
response = httpx.post("http://localhost:8000/api/maintenance/advice", json={
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "mileage": 45000,
    "last_service": "2024-01-15"
})
```

## Development

### Project Structure
```
ai-agent/
├── app/
│   ├── api/routes/          # API route handlers
│   ├── core/                # Core services and configuration
│   ├── models/              # Pydantic schemas
│   └── __init__.py
├── models/                  # Downloaded AI models cache
├── requirements.txt         # Python dependencies
├── main.py                 # FastAPI application
├── start.py                # Startup script
├── Dockerfile              # Container configuration
├── docker-compose.yml      # Multi-service setup
└── README.md
```

### Adding New Features

1. **Create new route module** in `app/api/routes/`
2. **Define schemas** in `app/models/schemas.py`
3. **Add business logic** to `app/core/ai_service.py`
4. **Register routes** in `main.py`

### Model Configuration

The AI service uses HuggingFace models. You can customize:

- **Chat Model**: Default is `microsoft/DialoGPT-medium`
- **Embeddings**: Uses `all-MiniLM-L6-v2` for semantic search
- **Parameters**: Temperature, top_p, max_tokens in config

## Integration with .NET Backend

The Community Car .NET API integrates with this AI service through HTTP calls:

```csharp
// In .NET Controller
[HttpPost("chat")]
public async Task<IActionResult> Chat([FromBody] ChatRequest request)
{
    var aiServiceUrl = _configuration["AIAgent:PythonServiceUrl"];
    var response = await _httpClient.PostAsync($"{aiServiceUrl}/api/chat", content);
    // Handle response
}
```

## Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Scale the service
docker-compose up --scale ai-agent=3
```

### Production Considerations

- Use production-grade models for better accuracy
- Implement proper logging and monitoring
- Set up Redis cluster for high availability
- Use load balancer for multiple instances
- Configure proper security headers and CORS

## Monitoring & Health Checks

- Health endpoint: `GET /health`
- Metrics: Built-in FastAPI metrics
- Logging: Structured JSON logging
- Docker health checks included

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Submit pull request

## License

MIT License - see LICENSE file for details