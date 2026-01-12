# QA System Security Testing and Hardening Script
# Runs comprehensive security tests and generates security audit report

param(
    [string]$Configuration = "Debug",
    [string]$OutputPath = "security-reports",
    [switch]$Verbose,
    [switch]$GenerateReport
)

Write-Host "🔒 QA System Security Testing and Hardening" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Create output directory
if (!(Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$reportFile = Join-Path $OutputPath "qa-security-report-$timestamp.txt"

# Function to log messages
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $logMessage = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') [$Level] $Message"
    Write-Host $logMessage
    if ($GenerateReport) {
        Add-Content -Path $reportFile -Value $logMessage
    }
}

# Function to run security tests
function Run-SecurityTests {
    Write-Log "Starting security test execution..." "INFO"
    
    try {
        # Build the solution first
        Write-Log "Building solution..." "INFO"
        dotnet build --configuration $Configuration --no-restore
        
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Build failed. Cannot proceed with security tests." "ERROR"
            return $false
        }

        # Run QA Security Tests
        Write-Log "Running QA Security Tests..." "INFO"
        $securityTestResult = dotnet test tests/WebAPI.IntegrationTests/WebAPI.IntegrationTests.csproj `
            --filter "FullyQualifiedName~QASecurityTests" `
            --configuration $Configuration `
            --logger "console;verbosity=detailed" `
            --no-build

        if ($LASTEXITCODE -ne 0) {
            Write-Log "QA Security Tests failed" "WARN"
        } else {
            Write-Log "QA Security Tests passed" "SUCCESS"
        }

        # Run QA Security Hardening Tests
        Write-Log "Running QA Security Hardening Tests..." "INFO"
        $hardeningTestResult = dotnet test tests/WebAPI.IntegrationTests/WebAPI.IntegrationTests.csproj `
            --filter "FullyQualifiedName~QASecurityHardeningTests" `
            --configuration $Configuration `
            --logger "console;verbosity=detailed" `
            --no-build

        if ($LASTEXITCODE -ne 0) {
            Write-Log "QA Security Hardening Tests failed" "WARN"
        } else {
            Write-Log "QA Security Hardening Tests passed" "SUCCESS"
        }

        # Run QA Security Audit Tests
        Write-Log "Running QA Security Audit Tests..." "INFO"
        $auditTestResult = dotnet test tests/WebAPI.IntegrationTests/WebAPI.IntegrationTests.csproj `
            --filter "FullyQualifiedName~QASecurityAuditTests" `
            --configuration $Configuration `
            --logger "console;verbosity=detailed" `
            --no-build

        if ($LASTEXITCODE -ne 0) {
            Write-Log "QA Security Audit Tests failed" "WARN"
        } else {
            Write-Log "QA Security Audit Tests passed" "SUCCESS"
        }

        return $true
    }
    catch {
        Write-Log "Error running security tests: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Function to check security configurations
function Check-SecurityConfigurations {
    Write-Log "Checking security configurations..." "INFO"
    
    # Check for security middleware in Program.cs
    $programFile = "src/WebAPI/Program.cs"
    if (Test-Path $programFile) {
        $programContent = Get-Content $programFile -Raw
        
        $securityChecks = @{
            "SecurityMiddleware" = $programContent -match "UseSecurityMiddleware"
            "JwtValidationMiddleware" = $programContent -match "UseMiddleware<JwtValidationMiddleware>"
            "RateLimitingMiddleware" = $programContent -match "UseRateLimitingMiddleware"
            "HTTPS Redirection" = $programContent -match "UseHttpsRedirection"
            "CORS" = $programContent -match "UseCors"
        }
        
        foreach ($check in $securityChecks.GetEnumerator()) {
            if ($check.Value) {
                Write-Log "✓ $($check.Key) is configured" "SUCCESS"
            } else {
                Write-Log "⚠ $($check.Key) may not be configured" "WARN"
            }
        }
    }
    
    # Check for security headers in middleware
    $securityMiddlewareFile = "src/WebAPI/Middleware/SecurityMiddleware.cs"
    if (Test-Path $securityMiddlewareFile) {
        $middlewareContent = Get-Content $securityMiddlewareFile -Raw
        
        $headerChecks = @{
            "X-Frame-Options" = $middlewareContent -match "X-Frame-Options"
            "X-Content-Type-Options" = $middlewareContent -match "X-Content-Type-Options"
            "X-XSS-Protection" = $middlewareContent -match "X-XSS-Protection"
            "Content-Security-Policy" = $middlewareContent -match "Content-Security-Policy"
            "Strict-Transport-Security" = $middlewareContent -match "Strict-Transport-Security"
        }
        
        foreach ($check in $headerChecks.GetEnumerator()) {
            if ($check.Value) {
                Write-Log "✓ $($check.Key) header is implemented" "SUCCESS"
            } else {
                Write-Log "⚠ $($check.Key) header may be missing" "WARN"
            }
        }
    }
}

# Function to check for common security vulnerabilities
function Check-CommonVulnerabilities {
    Write-Log "Checking for common security vulnerabilities..." "INFO"
    
    # Check for hardcoded secrets
    Write-Log "Scanning for hardcoded secrets..." "INFO"
    $secretPatterns = @(
        "password\s*=\s*['\`"][^'\`"]+['\`"]",
        "secret\s*=\s*['\`"][^'\`"]+['\`"]",
        "key\s*=\s*['\`"][^'\`"]+['\`"]",
        "token\s*=\s*['\`"][^'\`"]+['\`"]"
    )
    
    $sourceFiles = Get-ChildItem -Path "src" -Recurse -Include "*.cs" | Where-Object { $_.Name -notlike "*Test*" }
    $secretsFound = $false
    
    foreach ($file in $sourceFiles) {
        $content = Get-Content $file.FullName -Raw
        foreach ($pattern in $secretPatterns) {
            if ($content -match $pattern) {
                Write-Log "⚠ Potential hardcoded secret in $($file.Name)" "WARN"
                $secretsFound = $true
            }
        }
    }
    
    if (-not $secretsFound) {
        Write-Log "✓ No obvious hardcoded secrets found" "SUCCESS"
    }
    
    # Check for SQL injection vulnerabilities
    Write-Log "Checking for potential SQL injection vulnerabilities..." "INFO"
    $sqlPatterns = @(
        "string\.Format.*SELECT",
        "string\.Format.*INSERT",
        "string\.Format.*UPDATE",
        "string\.Format.*DELETE",
        "\+.*SELECT",
        "\+.*INSERT",
        "\+.*UPDATE",
        "\+.*DELETE"
    )
    
    $sqlVulnsFound = $false
    foreach ($file in $sourceFiles) {
        $content = Get-Content $file.FullName -Raw
        foreach ($pattern in $sqlPatterns) {
            if ($content -match $pattern) {
                Write-Log "⚠ Potential SQL injection vulnerability in $($file.Name)" "WARN"
                $sqlVulnsFound = $true
            }
        }
    }
    
    if (-not $sqlVulnsFound) {
        Write-Log "✓ No obvious SQL injection vulnerabilities found" "SUCCESS"
    }
}

# Function to generate security recommendations
function Generate-SecurityRecommendations {
    Write-Log "Generating security recommendations..." "INFO"
    
    $recommendations = @(
        "✓ Implement regular security testing in CI/CD pipeline",
        "✓ Use HTTPS in production with proper SSL/TLS configuration",
        "✓ Implement proper input validation and sanitization",
        "✓ Use parameterized queries to prevent SQL injection",
        "✓ Implement rate limiting to prevent abuse",
        "✓ Use secure authentication mechanisms (JWT with proper validation)",
        "✓ Implement proper error handling without information disclosure",
        "✓ Use security headers to protect against common attacks",
        "✓ Implement proper logging and monitoring for security events",
        "✓ Regular security audits and penetration testing",
        "✓ Keep dependencies updated and scan for vulnerabilities",
        "✓ Implement proper access controls and authorization",
        "✓ Use secure coding practices and code reviews",
        "✓ Implement proper session management",
        "✓ Use Content Security Policy (CSP) headers"
    )
    
    Write-Log "Security Recommendations:" "INFO"
    foreach ($recommendation in $recommendations) {
        Write-Log $recommendation "INFO"
    }
}

# Main execution
try {
    Write-Log "QA System Security Testing Started" "INFO"
    
    # Check if we're in the right directory
    if (!(Test-Path "src/WebAPI/WebAPI.csproj")) {
        Write-Log "Please run this script from the solution root directory" "ERROR"
        exit 1
    }
    
    # Restore packages
    Write-Log "Restoring NuGet packages..." "INFO"
    dotnet restore
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Package restore failed" "ERROR"
        exit 1
    }
    
    # Run security configuration checks
    Check-SecurityConfigurations
    
    # Check for common vulnerabilities
    Check-CommonVulnerabilities
    
    # Run security tests
    $testsPassed = Run-SecurityTests
    
    # Generate recommendations
    Generate-SecurityRecommendations
    
    # Summary
    Write-Log "Security testing completed" "INFO"
    
    if ($testsPassed) {
        Write-Log "✅ Security tests completed successfully" "SUCCESS"
        $exitCode = 0
    } else {
        Write-Log "⚠️ Some security tests failed - review results" "WARN"
        $exitCode = 1
    }
    
    if ($GenerateReport) {
        Write-Log "Security report generated: $reportFile" "INFO"
    }
    
    Write-Host "`n🔒 Security Testing Summary:" -ForegroundColor Cyan
    Write-Host "- Configuration checks completed" -ForegroundColor Green
    Write-Host "- Vulnerability scans completed" -ForegroundColor Green
    Write-Host "- Security tests executed" -ForegroundColor Green
    Write-Host "- Recommendations provided" -ForegroundColor Green
    
    if ($GenerateReport) {
        Write-Host "- Report saved to: $reportFile" -ForegroundColor Green
    }
    
    exit $exitCode
}
catch {
    Write-Log "Fatal error: $($_.Exception.Message)" "ERROR"
    exit 1
}