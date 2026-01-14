# Production Deployment Guide - Community Localization Enhancement

**Version:** 1.0  
**Date:** January 14, 2026  
**Status:** Production Ready  
**Task:** 41. Prepare production deployment

---

## Table of Contents

1. [Overview](#overview)
2. [CDN Configuration](#cdn-configuration)
3. [Caching Strategies](#caching-strategies)
4. [Monitoring and Alerting](#monitoring-and-alerting)
5. [Deployment Checklist](#deployment-checklist)
6. [Rollback Procedures](#rollback-procedures)
7. [Performance Optimization](#performance-optimization)
8. [Security Considerations](#security-considerations)

---

## Overview

This guide provides comprehensive instructions for deploying the Community Localization Enhancement system to production. The system supports 4 languages (en-US, ar-EG, ar-AE, ar-SA) with full RTL support and multi-level caching.

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CDN Layer                            │
│  (CloudFront / Azure CDN / Cloudflare)                      │
│  - Translation resource distribution                         │
│  - Static asset caching                                      │
│  - Global edge locations                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer                             │
│  - SSL/TLS termination                                       │
│  - Request routing                                           │
│  - Health checks                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Application Servers                         │
│  - ASP.NET Core API (Translation Service)                   │
│  - React Dashboard                                           │
│  - Angular Main App                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Caching Layer                             │
│  - Redis (Distributed Cache)                                 │
│  - Memory Cache (L1)                                         │
│  - CDN Cache (Edge)                                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│  - SQL Server (Translation Storage)                          │
│  - Read replicas for scaling                                 │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Prerequisites

- ✅ All E2E tests passing (20/20)
- ✅ Translation files validated for all 4 languages
- ✅ Backend API v7 endpoints tested
- ✅ Frontend applications built and tested
- ✅ Database migrations applied
- ✅ Redis cache configured
- ✅ SSL certificates obtained
- ✅ CDN account configured

---


## CDN Configuration

### 1. CDN Setup for Translation Resources

#### Option A: Azure CDN (Recommended for Azure deployments)

**Configuration Steps:**

1. **Create CDN Profile**
```bash
az cdn profile create \
  --name fully2car-cdn \
  --resource-group fully2car-prod \
  --sku Standard_Microsoft
```

2. **Create CDN Endpoint**
```bash
az cdn endpoint create \
  --name fully2car-translations \
  --profile-name fully2car-cdn \
  --resource-group fully2car-prod \
  --origin fully2car-api.azurewebsites.net \
  --origin-host-header fully2car-api.azurewebsites.net \
  --enable-compression true
```

3. **Configure Caching Rules**
```json
{
  "cachingRules": [
    {
      "name": "TranslationResources",
      "order": 1,
      "matchConditions": [
        {
          "matchVariable": "UrlPath",
          "operator": "BeginsWith",
          "matchValue": "/api/v7/localization/translations"
        }
      ],
      "actions": [
        {
          "name": "CacheExpiration",
          "parameters": {
            "cacheBehavior": "Override",
            "cacheDuration": "1.00:00:00"
          }
        }
      ]
    }
  ]
}
```

#### Option B: CloudFront (AWS)

**CloudFront Distribution Configuration:**

```yaml
# cloudfront-config.yaml
Distribution:
  Origins:
    - Id: api-origin
      DomainName: api.fully2car.com
      CustomOriginConfig:
        HTTPPort: 80
        HTTPSPort: 443
        OriginProtocolPolicy: https-only
  
  DefaultCacheBehavior:
    TargetOriginId: api-origin
    ViewerProtocolPolicy: redirect-to-https
    AllowedMethods: [GET, HEAD, OPTIONS]
    CachedMethods: [GET, HEAD]
    Compress: true
    DefaultTTL: 86400  # 24 hours
    MaxTTL: 604800     # 7 days
    MinTTL: 3600       # 1 hour
  
  CacheBehaviors:
    - PathPattern: /api/v7/localization/translations/*
      TargetOriginId: api-origin
      ViewerProtocolPolicy: https-only
      Compress: true
      DefaultTTL: 86400
      ForwardedValues:
        QueryString: true
        Headers:
          - Accept-Language
          - Authorization
```

#### Option C: Cloudflare

**Cloudflare Page Rules:**

```
Rule 1: Translation Resources
URL Pattern: *fully2car.com/api/v7/localization/translations/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 day
  - Browser Cache TTL: 4 hours
  - Respect Existing Headers: On

Rule 2: Translation Cache Invalidation
URL Pattern: *fully2car.com/api/v7/localization/cache*
Settings:
  - Cache Level: Bypass
```

### 2. CDN Purge/Invalidation Strategy

**Automatic Invalidation on Translation Updates:**

```csharp
// src/Application/Features/Shared/Localization/Commands/UpdateTranslationCommand.cs
public class UpdateTranslationCommandHandler : IRequestHandler<UpdateTranslationCommand, Result>
{
    private readonly ICdnInvalidationService _cdnService;
    
    public async Task<Result> Handle(UpdateTranslationCommand request, CancellationToken cancellationToken)
    {
        // Update translation in database
        await _repository.UpdateTranslationAsync(request);
        
        // Invalidate CDN cache
        await _cdnService.InvalidateTranslationCacheAsync(
            request.Culture, 
            request.Feature
        );
        
        return Result.Success();
    }
}
```

**CDN Invalidation Service Implementation:**

```csharp
// src/Infrastructure/Services/CdnInvalidationService.cs
public class CdnInvalidationService : ICdnInvalidationService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<CdnInvalidationService> _logger;
    
    public async Task InvalidateTranslationCacheAsync(string culture, string feature)
    {
        var cdnProvider = _configuration["CDN:Provider"]; // Azure, CloudFront, Cloudflare
        
        var paths = new[]
        {
            $"/api/v7/localization/translations/{culture}/{feature}",
            $"/api/v7/localization/translations/{culture}/*"
        };
        
        switch (cdnProvider)
        {
            case "Azure":
                await InvalidateAzureCdnAsync(paths);
                break;
            case "CloudFront":
                await InvalidateCloudFrontAsync(paths);
                break;
            case "Cloudflare":
                await InvalidateCloudflareAsync(paths);
                break;
        }
        
        _logger.LogInformation("CDN cache invalidated for {Culture}/{Feature}", culture, feature);
    }
}
```

### 3. CDN Configuration in appsettings.Production.json

```json
{
  "CDN": {
    "Provider": "Azure",
    "Enabled": true,
    "BaseUrl": "https://cdn.fully2car.com",
    "Azure": {
      "ProfileName": "fully2car-cdn",
      "EndpointName": "fully2car-translations",
      "ResourceGroup": "fully2car-prod",
      "SubscriptionId": "${AZURE_SUBSCRIPTION_ID}"
    },
    "CloudFront": {
      "DistributionId": "${CLOUDFRONT_DISTRIBUTION_ID}",
      "AccessKeyId": "${AWS_ACCESS_KEY_ID}",
      "SecretAccessKey": "${AWS_SECRET_ACCESS_KEY}"
    },
    "Cloudflare": {
      "ZoneId": "${CLOUDFLARE_ZONE_ID}",
      "ApiToken": "${CLOUDFLARE_API_TOKEN}"
    },
    "CacheControl": {
      "TranslationResources": "public, max-age=86400, s-maxage=604800",
      "StaticAssets": "public, max-age=31536000, immutable"
    }
  }
}
```

---


## Caching Strategies

### Multi-Level Caching Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Level 1: Browser Cache (Client-side)                        │
│ TTL: 4 hours                                                 │
│ Storage: localStorage + memory                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Level 2: CDN Edge Cache                                      │
│ TTL: 24 hours                                                │
│ Storage: CDN edge locations globally                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Level 3: Application Memory Cache (L1)                      │
│ TTL: 1 hour                                                  │
│ Storage: In-process memory (IMemoryCache)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Level 4: Redis Distributed Cache (L2)                       │
│ TTL: 24 hours                                                │
│ Storage: Redis cluster                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Level 5: Database (Source of Truth)                         │
│ Storage: SQL Server                                          │
└─────────────────────────────────────────────────────────────┘
```

### Production Caching Configuration

**appsettings.Production.json:**

```json
{
  "Caching": {
    "Memory": {
      "Enabled": true,
      "SizeLimit": 1024,
      "CompactionPercentage": 0.25,
      "ExpirationScanFrequency": "00:05:00",
      "DefaultExpiration": "01:00:00"
    },
    "Redis": {
      "Enabled": true,
      "Configuration": "${REDIS_CONNECTION_STRING}",
      "InstanceName": "fully2car:",
      "DefaultExpiration": "1.00:00:00",
      "ConnectTimeout": 5000,
      "SyncTimeout": 5000,
      "AbortOnConnectFail": false,
      "ConnectRetry": 3
    },
    "Translation": {
      "MemoryCacheDuration": "01:00:00",
      "RedisCacheDuration": "1.00:00:00",
      "CdnCacheDuration": "1.00:00:00",
      "BrowserCacheDuration": "04:00:00",
      "EnableCacheWarming": true,
      "WarmupLanguages": ["en-US", "ar-EG", "ar-AE", "ar-SA"],
      "WarmupFeatures": ["posts", "groups", "qa", "reviews", "social", "maps", "news", "guides"]
    }
  }
}
```

### Cache Warming Strategy

**Startup Cache Warming:**

```csharp
// src/WebAPI/Program.cs
public static async Task Main(string[] args)
{
    var app = builder.Build();
    
    // Warm up translation cache on startup
    using (var scope = app.Services.CreateScope())
    {
        var cacheWarmupService = scope.ServiceProvider
            .GetRequiredService<ITranslationCacheWarmupService>();
        
        await cacheWarmupService.WarmupCacheAsync();
    }
    
    await app.RunAsync();
}
```

**Cache Warmup Service:**

```csharp
// src/Infrastructure/Services/TranslationCacheWarmupService.cs
public class TranslationCacheWarmupService : ITranslationCacheWarmupService
{
    public async Task WarmupCacheAsync()
    {
        var languages = new[] { "en-US", "ar-EG", "ar-AE", "ar-SA" };
        var features = new[] { "posts", "groups", "qa", "reviews", "social", "maps", "news", "guides" };
        
        var tasks = new List<Task>();
        
        foreach (var language in languages)
        {
            foreach (var feature in features)
            {
                tasks.Add(_translationService.GetTranslationsAsync(language, feature));
            }
        }
        
        await Task.WhenAll(tasks);
        
        _logger.LogInformation("Translation cache warmed up for {LanguageCount} languages and {FeatureCount} features", 
            languages.Length, features.Length);
    }
}
```

### Cache Invalidation Strategy

**Invalidation Triggers:**

1. **Translation Update** - Invalidate specific culture/feature
2. **Bulk Update** - Invalidate all translations for a culture
3. **Manual Purge** - Admin-triggered cache clear
4. **Scheduled Refresh** - Daily cache refresh at low-traffic hours

**Cache Invalidation Endpoint:**

```csharp
// src/WebAPI/Controllers/Shared/LocalizationV7Controller.cs
[HttpDelete("cache")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> InvalidateCache(
    [FromQuery] string? culture = null,
    [FromQuery] string? feature = null)
{
    await _translationService.InvalidateCacheAsync(culture, feature);
    await _cdnService.InvalidateTranslationCacheAsync(culture, feature);
    
    return Ok(new { message = "Cache invalidated successfully" });
}
```

### Cache Monitoring

**Cache Hit Rate Metrics:**

```csharp
public class CacheMetricsMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/v7/localization"))
        {
            var cacheHit = context.Items.ContainsKey("CacheHit") && 
                          (bool)context.Items["CacheHit"];
            
            _metrics.RecordCacheHit(cacheHit);
        }
        
        await _next(context);
    }
}
```

---


## Monitoring and Alerting

### 1. Application Insights / Azure Monitor Configuration

**appsettings.Production.json:**

```json
{
  "ApplicationInsights": {
    "ConnectionString": "${APPLICATIONINSIGHTS_CONNECTION_STRING}",
    "EnableAdaptiveSampling": true,
    "EnablePerformanceCounterCollectionModule": true,
    "EnableDependencyTrackingTelemetryModule": true,
    "EnableRequestTrackingTelemetryModule": true
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information",
      "Infrastructure.Services.TranslationService": "Information"
    },
    "ApplicationInsights": {
      "LogLevel": {
        "Default": "Information"
      }
    }
  }
}
```

### 2. Custom Metrics and Telemetry

**Translation Service Telemetry:**

```csharp
// src/Infrastructure/Services/TranslationService.cs
public class TranslationService : ITranslationService
{
    private readonly TelemetryClient _telemetry;
    
    public async Task<Dictionary<string, string>> GetTranslationsAsync(string culture, string feature)
    {
        using var operation = _telemetry.StartOperation<RequestTelemetry>("GetTranslations");
        operation.Telemetry.Properties["Culture"] = culture;
        operation.Telemetry.Properties["Feature"] = feature;
        
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            var translations = await LoadTranslationsAsync(culture, feature);
            
            stopwatch.Stop();
            
            // Track success metrics
            _telemetry.TrackMetric("TranslationLoadTime", stopwatch.ElapsedMilliseconds);
            _telemetry.TrackMetric("TranslationKeyCount", translations.Count);
            _telemetry.TrackEvent("TranslationLoaded", new Dictionary<string, string>
            {
                { "Culture", culture },
                { "Feature", feature },
                { "KeyCount", translations.Count.ToString() },
                { "Duration", stopwatch.ElapsedMilliseconds.ToString() }
            });
            
            return translations;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            
            // Track failure metrics
            _telemetry.TrackException(ex, new Dictionary<string, string>
            {
                { "Culture", culture },
                { "Feature", feature },
                { "Duration", stopwatch.ElapsedMilliseconds.ToString() }
            });
            
            throw;
        }
    }
}
```

### 3. Key Performance Indicators (KPIs)

**Metrics to Monitor:**

| Metric | Target | Alert Threshold | Critical Threshold |
|--------|--------|-----------------|-------------------|
| Translation API Response Time | < 100ms | > 200ms | > 500ms |
| Cache Hit Rate | > 95% | < 90% | < 80% |
| Translation Load Time | < 50ms | > 100ms | > 200ms |
| API Availability | 99.9% | < 99.5% | < 99% |
| Error Rate | < 0.1% | > 0.5% | > 1% |
| CDN Cache Hit Rate | > 90% | < 85% | < 75% |
| Redis Connection Failures | 0 | > 5/hour | > 20/hour |
| Memory Cache Size | < 500MB | > 750MB | > 1GB |

### 4. Alert Rules Configuration

**Azure Monitor Alert Rules:**

```json
{
  "alerts": [
    {
      "name": "High Translation API Response Time",
      "description": "Translation API response time exceeds 200ms",
      "severity": "Warning",
      "condition": {
        "metric": "requests/duration",
        "aggregation": "Average",
        "operator": "GreaterThan",
        "threshold": 200,
        "windowSize": "PT5M"
      },
      "actions": [
        {
          "actionGroupId": "/subscriptions/{subscription}/resourceGroups/{rg}/providers/microsoft.insights/actionGroups/DevOpsTeam"
        }
      ]
    },
    {
      "name": "Low Cache Hit Rate",
      "description": "Translation cache hit rate below 90%",
      "severity": "Warning",
      "condition": {
        "metric": "customMetrics/CacheHitRate",
        "aggregation": "Average",
        "operator": "LessThan",
        "threshold": 90,
        "windowSize": "PT15M"
      }
    },
    {
      "name": "Translation Service Errors",
      "description": "High error rate in translation service",
      "severity": "Error",
      "condition": {
        "metric": "exceptions/count",
        "aggregation": "Count",
        "operator": "GreaterThan",
        "threshold": 10,
        "windowSize": "PT5M"
      }
    },
    {
      "name": "Redis Connection Failures",
      "description": "Redis cache connection failures detected",
      "severity": "Critical",
      "condition": {
        "metric": "customMetrics/RedisConnectionFailures",
        "aggregation": "Count",
        "operator": "GreaterThan",
        "threshold": 5,
        "windowSize": "PT5M"
      }
    }
  ]
}
```

### 5. Health Check Endpoints

**Health Check Configuration:**

```csharp
// src/WebAPI/Program.cs
builder.Services.AddHealthChecks()
    .AddCheck<TranslationServiceHealthCheck>("translation-service")
    .AddCheck<RedisCacheHealthCheck>("redis-cache")
    .AddCheck<DatabaseHealthCheck>("database")
    .AddCheck<CdnHealthCheck>("cdn");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

**Translation Service Health Check:**

```csharp
public class TranslationServiceHealthCheck : IHealthCheck
{
    private readonly ITranslationService _translationService;
    
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Test translation loading
            var translations = await _translationService.GetTranslationsAsync("en-US", "common");
            
            if (translations == null || translations.Count == 0)
            {
                return HealthCheckResult.Degraded("Translation service returned empty results");
            }
            
            return HealthCheckResult.Healthy("Translation service is operational");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Translation service is unavailable", ex);
        }
    }
}
```

### 6. Logging Strategy

**Structured Logging with Serilog:**

```csharp
// src/WebAPI/Program.cs
builder.Host.UseSerilog((context, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithMachineName()
        .Enrich.WithEnvironmentName()
        .WriteTo.Console()
        .WriteTo.ApplicationInsights(
            context.Configuration["ApplicationInsights:ConnectionString"],
            TelemetryConverter.Traces)
        .WriteTo.File(
            path: "logs/app-.log",
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 30);
});
```

**Log Levels by Component:**

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "Microsoft.EntityFrameworkCore": "Warning",
        "System": "Warning",
        "Infrastructure.Services.TranslationService": "Information",
        "Infrastructure.Services.CdnInvalidationService": "Information",
        "Infrastructure.Repositories.TranslationRepository": "Debug"
      }
    }
  }
}
```

### 7. Dashboard and Visualization

**Application Insights Dashboard Queries:**

```kusto
// Translation API Performance
requests
| where name contains "GetTranslations"
| summarize 
    AvgDuration = avg(duration),
    P95Duration = percentile(duration, 95),
    P99Duration = percentile(duration, 99),
    RequestCount = count()
    by bin(timestamp, 5m)
| render timechart

// Cache Hit Rate
customMetrics
| where name == "CacheHitRate"
| summarize AvgHitRate = avg(value) by bin(timestamp, 15m)
| render timechart

// Error Rate by Culture
exceptions
| where customDimensions.Culture != ""
| summarize ErrorCount = count() by tostring(customDimensions.Culture), bin(timestamp, 1h)
| render barchart

// Translation Load Time Distribution
customMetrics
| where name == "TranslationLoadTime"
| summarize percentiles(value, 50, 75, 90, 95, 99) by bin(timestamp, 1h)
| render timechart
```

---


## Deployment Checklist

### Pre-Deployment Checklist

- [ ] **Code Quality**
  - [ ] All E2E tests passing (20/20)
  - [ ] All unit tests passing
  - [ ] Code review completed
  - [ ] Security scan completed
  - [ ] Performance testing completed

- [ ] **Configuration**
  - [ ] Production appsettings.json configured
  - [ ] Environment variables set
  - [ ] Connection strings secured in Key Vault
  - [ ] CDN configuration validated
  - [ ] Redis connection string configured
  - [ ] SSL certificates installed

- [ ] **Database**
  - [ ] Migrations applied to production database
  - [ ] Database backup completed
  - [ ] Read replicas configured (if applicable)
  - [ ] Connection pooling optimized

- [ ] **Translation Resources**
  - [ ] All 32 translation files validated (8 features × 4 languages)
  - [ ] Translation completeness verified
  - [ ] RTL translations tested
  - [ ] Translation files uploaded to CDN

- [ ] **Infrastructure**
  - [ ] Load balancer configured
  - [ ] Auto-scaling rules set
  - [ ] Health check endpoints tested
  - [ ] Monitoring alerts configured
  - [ ] Log aggregation configured

### Deployment Steps

**Step 1: Database Migration**
```bash
# Backup production database
az sql db export \
  --resource-group fully2car-prod \
  --server fully2car-sql \
  --name fully2car-db \
  --storage-key-type StorageAccessKey \
  --storage-key $STORAGE_KEY \
  --storage-uri "https://fully2carbackup.blob.core.windows.net/backups/pre-deployment-$(date +%Y%m%d).bacpac"

# Apply migrations
dotnet ef database update --project src/Infrastructure --startup-project src/WebAPI --configuration Release
```

**Step 2: Deploy Backend API**
```bash
# Build and publish
dotnet publish src/WebAPI/WebAPI.csproj -c Release -o ./publish

# Deploy to Azure App Service
az webapp deployment source config-zip \
  --resource-group fully2car-prod \
  --name fully2car-api \
  --src ./publish.zip
```

**Step 3: Deploy Frontend Applications**
```bash
# Build Dashboard
cd ClientApp/Dashboard
npm run build
az storage blob upload-batch \
  --account-name fully2carstorage \
  --destination '$web' \
  --source ./dist

# Build Main App
cd ../Main
npm run build
az storage blob upload-batch \
  --account-name fully2carstorage \
  --destination '$web/main' \
  --source ./dist
```

**Step 4: Configure CDN**
```bash
# Purge CDN cache
az cdn endpoint purge \
  --resource-group fully2car-prod \
  --profile-name fully2car-cdn \
  --name fully2car-translations \
  --content-paths "/*"

# Warm up cache
curl -X POST https://api.fully2car.com/api/v7/localization/cache/warm
```

**Step 5: Verify Deployment**
```bash
# Check health endpoints
curl https://api.fully2car.com/health
curl https://api.fully2car.com/health/ready

# Test translation endpoints
curl https://api.fully2car.com/api/v7/localization/translations/en-US/posts
curl https://api.fully2car.com/api/v7/localization/translations/ar-EG/posts

# Verify CDN
curl -I https://cdn.fully2car.com/api/v7/localization/translations/en-US/posts
```

### Post-Deployment Checklist

- [ ] **Verification**
  - [ ] Health checks passing
  - [ ] Translation API responding
  - [ ] CDN serving translations
  - [ ] Cache hit rate > 90%
  - [ ] All 4 languages accessible
  - [ ] RTL layouts working

- [ ] **Monitoring**
  - [ ] Application Insights receiving telemetry
  - [ ] Alerts configured and tested
  - [ ] Dashboards displaying metrics
  - [ ] Log aggregation working

- [ ] **Performance**
  - [ ] API response time < 100ms
  - [ ] Translation load time < 50ms
  - [ ] CDN cache hit rate > 90%
  - [ ] No memory leaks detected

- [ ] **User Acceptance**
  - [ ] Smoke tests completed
  - [ ] Language switching tested
  - [ ] RTL layouts verified
  - [ ] Cross-browser testing completed

---

## Rollback Procedures

### Rollback Triggers

Initiate rollback if:
- Error rate > 5%
- API response time > 1000ms for 5+ minutes
- Cache hit rate < 50%
- Critical functionality broken
- Data corruption detected

### Rollback Steps

**Step 1: Immediate Actions**
```bash
# Switch to previous deployment slot
az webapp deployment slot swap \
  --resource-group fully2car-prod \
  --name fully2car-api \
  --slot staging \
  --target-slot production

# Revert CDN configuration
az cdn endpoint update \
  --resource-group fully2car-prod \
  --profile-name fully2car-cdn \
  --name fully2car-translations \
  --origin-path /previous
```

**Step 2: Database Rollback (if needed)**
```bash
# Restore from backup
az sql db restore \
  --resource-group fully2car-prod \
  --server fully2car-sql \
  --name fully2car-db \
  --dest-name fully2car-db-restored \
  --time "2026-01-14T10:00:00Z"
```

**Step 3: Verify Rollback**
```bash
# Check health
curl https://api.fully2car.com/health

# Verify translations
curl https://api.fully2car.com/api/v7/localization/translations/en-US/posts
```

---

## Performance Optimization

### Backend Optimizations

1. **Connection Pooling**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=...;Min Pool Size=10;Max Pool Size=100;Connection Timeout=30;"
  }
}
```

2. **Response Compression**
```csharp
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
    options.Providers.Add<BrotliCompressionProvider>();
});
```

3. **Output Caching**
```csharp
app.UseOutputCache();

app.MapGet("/api/v7/localization/translations/{culture}/{feature}", 
    async (string culture, string feature) => { ... })
    .CacheOutput(policy => policy.Expire(TimeSpan.FromHours(1)));
```

### Frontend Optimizations

1. **Code Splitting**
```typescript
// Lazy load translation modules
const loadTranslations = (language: string) => 
  import(`./translations/${language}.json`);
```

2. **Service Worker Caching**
```javascript
// Cache translation resources
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/localization/translations/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

---

## Security Considerations

### 1. API Security

- ✅ HTTPS enforced for all endpoints
- ✅ CORS configured for allowed origins only
- ✅ Rate limiting implemented
- ✅ API keys for CDN invalidation
- ✅ Input validation on all endpoints

### 2. Data Security

- ✅ Connection strings in Azure Key Vault
- ✅ Encryption at rest for database
- ✅ Encryption in transit (TLS 1.2+)
- ✅ No sensitive data in translation files
- ✅ Regular security audits

### 3. Access Control

- ✅ Role-based access for admin endpoints
- ✅ JWT authentication for user-specific features
- ✅ CDN access restricted to application domains
- ✅ Redis password protected

---

## Maintenance Windows

### Scheduled Maintenance

- **Weekly Cache Refresh:** Sunday 2:00 AM UTC
- **Monthly Security Updates:** First Sunday 3:00 AM UTC
- **Quarterly Performance Review:** First Monday of quarter

### Maintenance Procedures

```bash
# Weekly cache refresh
curl -X POST https://api.fully2car.com/api/v7/localization/cache/warm

# Clear old logs
find /var/log/fully2car -name "*.log" -mtime +30 -delete

# Database maintenance
az sql db update --resource-group fully2car-prod --server fully2car-sql --name fully2car-db --service-objective S3
```

---

## Support and Escalation

### Support Tiers

**Tier 1: Monitoring Alerts**
- Automated alerts via Application Insights
- Response time: Immediate (automated)

**Tier 2: DevOps Team**
- Email: devops@fully2car.com
- Slack: #devops-alerts
- Response time: 15 minutes

**Tier 3: Engineering Team**
- On-call rotation
- Response time: 30 minutes
- Escalation for critical issues

### Contact Information

- **DevOps Lead:** devops-lead@fully2car.com
- **Backend Team:** backend-team@fully2car.com
- **Frontend Team:** frontend-team@fully2car.com
- **Emergency Hotline:** +1-XXX-XXX-XXXX

---

## Appendix

### Environment Variables

```bash
# Azure
AZURE_SUBSCRIPTION_ID=xxx
AZURE_TENANT_ID=xxx
AZURE_CLIENT_ID=xxx
AZURE_CLIENT_SECRET=xxx

# Database
DATABASE_CONNECTION_STRING=xxx

# Redis
REDIS_CONNECTION_STRING=xxx

# Application Insights
APPLICATIONINSIGHTS_CONNECTION_STRING=xxx

# CDN
CDN_PROFILE_NAME=fully2car-cdn
CDN_ENDPOINT_NAME=fully2car-translations

# Feature Flags
ENABLE_CDN=true
ENABLE_CACHE_WARMING=true
ENABLE_TELEMETRY=true
```

### Useful Commands

```bash
# View application logs
az webapp log tail --resource-group fully2car-prod --name fully2car-api

# Scale application
az appservice plan update --resource-group fully2car-prod --name fully2car-plan --sku P2V2

# Check Redis status
redis-cli -h fully2car-redis.redis.cache.windows.net -p 6380 -a $REDIS_KEY ping

# Monitor CDN
az cdn endpoint show --resource-group fully2car-prod --profile-name fully2car-cdn --name fully2car-translations
```

---

**Document Version:** 1.0  
**Last Updated:** January 14, 2026  
**Next Review:** February 14, 2026

---

**End of Production Deployment Guide**
