# Community Car Dashboard - Deployment Guide

## Environment Configuration

This dashboard uses environment variables for configuration. Follow this guide to set up your environment for different deployment scenarios.

## Environment Files

- `.env` - Default environment variables (used for development)
- `.env.example` - Template file with all available variables
- `.env.production` - Production-ready configuration template
- `.env.local` - Local overrides (not committed to git)

## Quick Setup

### 1. Development Setup
```bash
# Copy the example file
cp .env.example .env

# Update the API URL if your backend runs on a different port
# Edit .env and change VITE_API_BASE_URL if needed
```

### 2. Production Setup
```bash
# Copy the production template
cp .env.production .env

# Update the following REQUIRED variables:
# - VITE_API_BASE_URL: Your production API URL
# - VITE_AI_AGENT_URL: Your AI agent service URL
# - VITE_WS_URL: Your WebSocket URL for real-time features
```

## Required Environment Variables

### Core Configuration
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Main API endpoint | `https://api.yourdomain.com/api` |
| `VITE_AI_AGENT_URL` | AI Agent service URL | `https://ai.yourdomain.com/api` |
| `VITE_WS_URL` | WebSocket URL for SignalR | `wss://api.yourdomain.com/hub` |
| `VITE_APP_ENV` | Environment name | `production` |

### Optional Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_DEBUG` | Enable debug mode | `false` |
| `VITE_DEFAULT_THEME` | Default UI theme | `light` |
| `VITE_DEFAULT_LANGUAGE` | Default language | `en` |

## Deployment Platforms

### Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Docker
```dockerfile
# Use the production environment file
COPY .env.production .env
```

### Traditional Hosting
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your web server to serve the SPA correctly

## Build Commands

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## Environment Variable Categories

### 🔧 API Configuration
- API endpoints and service URLs
- Request timeouts and retry settings

### 🎨 UI/UX Settings
- Theme and language defaults
- Pagination and display settings

### 🔐 Security & Authentication
- JWT and session settings
- OAuth provider configuration

### 📊 Analytics & Monitoring
- Google Analytics, Sentry, Application Insights

### 🛍️ Marketplace Features
- Commission rates, currency settings
- Payment provider configuration

### ⚡ Performance Settings
- Caching, lazy loading, compression

## Security Notes

1. **Never commit sensitive keys** to version control
2. **Use different keys** for development and production
3. **Rotate keys regularly** in production
4. **Use environment-specific configurations**

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check `VITE_API_BASE_URL` is correct
   - Ensure CORS is configured on the backend
   - Verify the backend is running and accessible

2. **Real-time Features Not Working**
   - Check `VITE_WS_URL` is correct
   - Ensure WebSocket connections are allowed
   - Verify SignalR hub is configured on backend

3. **Features Not Appearing**
   - Check feature flags (VITE_FEATURE_*)
   - Ensure all required environment variables are set

### Debug Mode
Enable debug mode to see detailed logs:
```bash
VITE_DEBUG=true
```

## Support

For deployment issues, check:
1. Browser console for errors
2. Network tab for failed requests
3. Environment variable values
4. Backend API health endpoints

## Version Information

- Dashboard Version: 1.0.0
- Node.js: >= 18.0.0
- npm: >= 8.0.0