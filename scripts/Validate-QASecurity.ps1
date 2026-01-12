# QA System Security Validation Script
# Performs static security analysis without requiring full build

param(
    [string]$OutputPath = "security-reports",
    [switch]$Verbose
)

Write-Host "🔒 QA System Security Validation" -ForegroundColor Cyan
Write-Host "=" * 40 -ForegroundColor Cyan

# Create output directory
if (!(Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$reportFile = Join-Path $OutputPath "qa-security-validation-$timestamp.txt"

# Function to log messages
function Write-SecurityLog {
    param([string]$Message, [string]$Level = "INFO")
    $logMessage = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') [$Level] $Message"
    Write-Host $logMessage
    Add-Content -Path $reportFile -Value $logMessage
}

# Function to check security middleware configuration
function Test-SecurityMiddleware {
    Write-SecurityLog "Checking security middleware configuration..." "INFO"
    
    $programFile = "src/WebAPI/Program.cs"
    if (Test-Path $programFile) {
        $programContent = Get-Content $programFile -Raw
        
        $middlewareChecks = @{
            "SecurityMiddleware" = $programContent -match "UseSecurityMiddleware|UseMiddleware<SecurityMiddleware>"
            "QASecurityMiddleware" = $programContent -match "UseMiddleware<QASecurityMiddleware>"
            "RateLimitingMiddleware" = $programContent -match "UseRateLimitingMiddleware|UseMiddleware<RateLimitingMiddleware>"
            "JwtValidationMiddleware" = $programContent -match "UseMiddleware<JwtValidationMiddleware>"
            "HTTPS Redirection" = $programContent -match "UseHttpsRedirection"
            "CORS Configuration" = $programContent -match "UseCors"
            "Authentication" = $programContent -match "UseAuthentication"
            "Authorization" = $programContent -match "UseAuthorization"
        }
        
        $passedChecks = 0
        foreach ($check in $middlewareChecks.GetEnumerator()) {
            if ($check.Value) {
                Write-SecurityLog "✓ $($check.Key) is configured" "SUCCESS"
                $passedChecks++
            } else {
                Write-SecurityLog "⚠ $($check.Key) may not be configured" "WARN"
            }
        }
        
        $complianceRate = ($passedChecks / $middlewareChecks.Count) * 100
        Write-SecurityLog "Middleware configuration compliance: $([math]::Round($complianceRate, 1))%" "INFO"
        
        return $complianceRate -ge 80
    } else {
        Write-SecurityLog "Program.cs not found" "ERROR"
        return $false
    }
}

# Function to check security headers implementation
function Test-SecurityHeaders {
    Write-SecurityLog "Checking security headers implementation..." "INFO"
    
    $securityMiddlewareFile = "src/WebAPI/Middleware/SecurityMiddleware.cs"
    if (Test-Path $securityMiddlewareFile) {
        $middlewareContent = Get-Content $securityMiddlewareFile -Raw
        
        $headerChecks = @{
            "X-Frame-Options" = $middlewareContent -match "X-Frame-Options"
            "X-Content-Type-Options" = $middlewareContent -match "X-Content-Type-Options"
            "X-XSS-Protection" = $middlewareContent -match "X-XSS-Protection"
            "Content-Security-Policy" = $middlewareContent -match "Content-Security-Policy"
            "Strict-Transport-Security" = $middlewareContent -match "Strict-Transport-Security"
            "Referrer-Policy" = $middlewareContent -match "Referrer-Policy"
            "Permissions-Policy" = $middlewareContent -match "Permissions-Policy"
        }
        
        $passedHeaders = 0
        foreach ($check in $headerChecks.GetEnumerator()) {
            if ($check.Value) {
                Write-SecurityLog "✓ $($check.Key) header is implemented" "SUCCESS"
                $passedHeaders++
            } else {
                Write-SecurityLog "⚠ $($check.Key) header may be missing" "WARN"
            }
        }
        
        $headerCompliance = ($passedHeaders / $headerChecks.Count) * 100
        Write-SecurityLog "Security headers compliance: $([math]::Round($headerCompliance, 1))%" "INFO"
        
        return $headerCompliance -ge 70
    } else {
        Write-SecurityLog "SecurityMiddleware.cs not found" "ERROR"
        return $false
    }
}

# Function to scan for hardcoded secrets
function Test-HardcodedSecrets {
    Write-SecurityLog "Scanning for hardcoded secrets..." "INFO"
    
    $secretPatterns = @(
        @{ Pattern = "password\s*=\s*['\`"][^'\`"]+['\`"]"; Description = "Hardcoded passwords" },
        @{ Pattern = "secret\s*=\s*['\`"][^'\`"]+['\`"]"; Description = "Hardcoded secrets" },
        @{ Pattern = "key\s*=\s*['\`"][^'\`"]+['\`"]"; Description = "Hardcoded keys" },
        @{ Pattern = "token\s*=\s*['\`"][^'\`"]+['\`"]"; Description = "Hardcoded tokens" },
        @{ Pattern = "connectionstring\s*=\s*['\`"][^'\`"]+['\`"]"; Description = "Hardcoded connection strings" },
        @{ Pattern = "[a-zA-Z0-9]{32}"; Description = "Potential API keys or secrets" }
    )
    
    $sourceFiles = Get-ChildItem -Path "src" -Recurse -Include "*.cs" | Where-Object { 
        $_.Name -notlike "*Test*" -and $_.Directory.Name -ne "Migrations" 
    }
    
    $secretsFound = 0
    $totalFiles = $sourceFiles.Count
    
    foreach ($file in $sourceFiles) {
        $content = Get-Content $file.FullName -Raw
        foreach ($patternInfo in $secretPatterns) {
            if ($content -match $patternInfo.Pattern) {
                Write-SecurityLog "⚠ Potential $($patternInfo.Description.ToLower()) in $($file.Name)" "WARN"
                $secretsFound++
                break
            }
        }
    }
    
    if ($secretsFound -eq 0) {
        Write-SecurityLog "✓ No obvious hardcoded secrets found in $totalFiles files" "SUCCESS"
        return $true
    } else {
        Write-SecurityLog "Found potential secrets in $secretsFound files out of $totalFiles" "WARN"
        return $false
    }
}

# Function to check for SQL injection vulnerabilities
function Test-SQLInjectionVulnerabilities {
    Write-SecurityLog "Checking for potential SQL injection vulnerabilities..." "INFO"
    
    $sqlPatterns = @(
        @{ Pattern = "string\.Format.*SELECT"; Description = "String.Format with SELECT" },
        @{ Pattern = "string\.Format.*INSERT"; Description = "String.Format with INSERT" },
        @{ Pattern = "string\.Format.*UPDATE"; Description = "String.Format with UPDATE" },
        @{ Pattern = "string\.Format.*DELETE"; Description = "String.Format with DELETE" },
        @{ Pattern = "\+.*SELECT"; Description = "String concatenation with SELECT" },
        @{ Pattern = "\+.*INSERT"; Description = "String concatenation with INSERT" },
        @{ Pattern = "\+.*UPDATE"; Description = "String concatenation with UPDATE" },
        @{ Pattern = "\+.*DELETE"; Description = "String concatenation with DELETE" },
        @{ Pattern = "\$"".*SELECT"; Description = "String interpolation with SELECT" },
        @{ Pattern = "\$"".*INSERT"; Description = "String interpolation with INSERT" }
    )
    
    $sourceFiles = Get-ChildItem -Path "src" -Recurse -Include "*.cs" | Where-Object { 
        $_.Name -notlike "*Test*" -and $_.Directory.Name -ne "Migrations" 
    }
    
    $vulnerabilitiesFound = 0
    
    foreach ($file in $sourceFiles) {
        $content = Get-Content $file.FullName -Raw
        foreach ($patternInfo in $sqlPatterns) {
            if ($content -match $patternInfo.Pattern) {
                Write-SecurityLog "⚠ Potential SQL injection vulnerability ($($patternInfo.Description)) in $($file.Name)" "WARN"
                $vulnerabilitiesFound++
            }
        }
    }
    
    if ($vulnerabilitiesFound -eq 0) {
        Write-SecurityLog "✓ No obvious SQL injection vulnerabilities found" "SUCCESS"
        return $true
    } else {
        Write-SecurityLog "Found $vulnerabilitiesFound potential SQL injection vulnerabilities" "WARN"
        return $false
    }
}

# Function to check input validation implementation
function Test-InputValidation {
    Write-SecurityLog "Checking input validation implementation..." "INFO"
    
    # Check for validation attributes and patterns
    $validationPatterns = @(
        @{ Pattern = "\[Required\]"; Description = "Required validation attributes" },
        @{ Pattern = "\[StringLength\]"; Description = "String length validation" },
        @{ Pattern = "\[Range\]"; Description = "Range validation" },
        @{ Pattern = "\[RegularExpression\]"; Description = "Regex validation" },
        @{ Pattern = "ModelState\.IsValid"; Description = "Model state validation" },
        @{ Pattern = "ValidationResult"; Description = "Custom validation" }
    )
    
    $sourceFiles = Get-ChildItem -Path "src" -Recurse -Include "*.cs" | Where-Object { 
        $_.Name -like "*Request*" -or $_.Name -like "*Command*" -or $_.Name -like "*Query*" -or $_.Name -like "*Controller*"
    }
    
    $validationFound = 0
    $totalFiles = $sourceFiles.Count
    
    foreach ($file in $sourceFiles) {
        $content = Get-Content $file.FullName -Raw
        foreach ($patternInfo in $validationPatterns) {
            if ($content -match $patternInfo.Pattern) {
                $validationFound++
                break
            }
        }
    }
    
    $validationRate = if ($totalFiles -gt 0) { ($validationFound / $totalFiles) * 100 } else { 0 }
    Write-SecurityLog "Input validation implementation rate: $([math]::Round($validationRate, 1))%" "INFO"
    
    if ($validationRate -ge 60) {
        Write-SecurityLog "✓ Good input validation coverage found" "SUCCESS"
        return $true
    } else {
        Write-SecurityLog "⚠ Low input validation coverage" "WARN"
        return $false
    }
}

# Function to check authentication and authorization implementation
function Test-AuthenticationAuthorization {
    Write-SecurityLog "Checking authentication and authorization implementation..." "INFO"
    
    # Check controllers for proper authorization
    $controllerFiles = Get-ChildItem -Path "src/WebAPI/Controllers" -Recurse -Include "*.cs"
    
    $authPatterns = @(
        @{ Pattern = "\[Authorize\]"; Description = "Authorize attributes" },
        @{ Pattern = "\[AllowAnonymous\]"; Description = "Allow anonymous attributes" },
        @{ Pattern = "User\.Identity\.IsAuthenticated"; Description = "Authentication checks" },
        @{ Pattern = "User\.IsInRole"; Description = "Role-based authorization" },
        @{ Pattern = "ClaimsPrincipal"; Description = "Claims-based authorization" }
    )
    
    $protectedControllers = 0
    $totalControllers = $controllerFiles.Count
    
    foreach ($file in $controllerFiles) {
        $content = Get-Content $file.FullName -Raw
        $hasAuth = $false
        
        foreach ($patternInfo in $authPatterns) {
            if ($content -match $patternInfo.Pattern) {
                $hasAuth = $true
                break
            }
        }
        
        if ($hasAuth) {
            $protectedControllers++
        } else {
            Write-SecurityLog "⚠ Controller $($file.Name) may lack authorization" "WARN"
        }
    }
    
    $authRate = if ($totalControllers -gt 0) { ($protectedControllers / $totalControllers) * 100 } else { 100 }
    Write-SecurityLog "Controller authorization coverage: $([math]::Round($authRate, 1))%" "INFO"
    
    return $authRate -ge 80
}

# Function to check for secure coding practices
function Test-SecureCodingPractices {
    Write-SecurityLog "Checking secure coding practices..." "INFO"
    
    $practiceChecks = @{
        "HTTPS Configuration" = (Test-Path "src/WebAPI/Properties/launchSettings.json") -and 
                               ((Get-Content "src/WebAPI/Properties/launchSettings.json" -Raw) -match "https://")
        "Secure Headers Middleware" = (Test-Path "src/WebAPI/Middleware/SecurityMiddleware.cs")
        "Rate Limiting" = (Test-Path "src/WebAPI/Middleware/RateLimitingMiddleware.cs")
        "Input Sanitization" = (Get-ChildItem -Path "src" -Recurse -Include "*.cs" | 
                               ForEach-Object { Get-Content $_.FullName -Raw } | 
                               Where-Object { $_ -match "HtmlEncoder|AntiXss|Sanitize" }).Count -gt 0
        "Parameterized Queries" = (Get-ChildItem -Path "src" -Recurse -Include "*.cs" | 
                                  ForEach-Object { Get-Content $_.FullName -Raw } | 
                                  Where-Object { $_ -match "SqlParameter|@\w+|Entity Framework" }).Count -gt 0
    }
    
    $passedPractices = 0
    foreach ($practice in $practiceChecks.GetEnumerator()) {
        if ($practice.Value) {
            Write-SecurityLog "✓ $($practice.Key) is implemented" "SUCCESS"
            $passedPractices++
        } else {
            Write-SecurityLog "⚠ $($practice.Key) may not be implemented" "WARN"
        }
    }
    
    $practiceRate = ($passedPractices / $practiceChecks.Count) * 100
    Write-SecurityLog "Secure coding practices compliance: $([math]::Round($practiceRate, 1))%" "INFO"
    
    return $practiceRate -ge 70
}
    
    return $practiceRate -ge 70
}

# Function to generate security recommendations
function Write-SecurityRecommendations {
    Write-SecurityLog "Security Recommendations:" "INFO"
    Write-SecurityLog "=========================" "INFO"
    
    $recommendations = @(
        "✓ Implement comprehensive input validation on all user inputs",
        "✓ Use parameterized queries to prevent SQL injection attacks",
        "✓ Implement proper authentication and authorization mechanisms",
        "✓ Add security headers to protect against common web attacks",
        "✓ Use HTTPS in production with proper SSL/TLS configuration",
        "✓ Implement rate limiting to prevent abuse and DoS attacks",
        "✓ Sanitize and validate all output to prevent XSS attacks",
        "✓ Implement proper error handling without information disclosure",
        "✓ Use secure session management and token handling",
        "✓ Implement comprehensive logging for security events",
        "✓ Regular security testing and code reviews",
        "✓ Keep dependencies updated and scan for vulnerabilities",
        "✓ Implement proper access controls and principle of least privilege",
        "✓ Use Content Security Policy (CSP) headers",
        "✓ Implement proper CORS configuration",
        "✓ Regular penetration testing and security audits"
    )
    
    foreach ($recommendation in $recommendations) {
        Write-SecurityLog $recommendation "INFO"
    }
}

# Main execution function
function Start-SecurityValidation {
    Write-SecurityLog "QA System Security Validation Started" "INFO"
    Write-SecurityLog "=====================================" "INFO"
    
    # Check if we're in the right directory
    if (!(Test-Path "src/WebAPI/WebAPI.csproj")) {
        Write-SecurityLog "Please run this script from the solution root directory" "ERROR"
        return $false
    }
    
    $testResults = @{}
    
    # Run all security tests
    $testResults["Middleware Configuration"] = Test-SecurityMiddleware
    $testResults["Security Headers"] = Test-SecurityHeaders
    $testResults["Hardcoded Secrets"] = Test-HardcodedSecrets
    $testResults["SQL Injection Protection"] = Test-SQLInjectionVulnerabilities
    $testResults["Input Validation"] = Test-InputValidation
    $testResults["Authentication/Authorization"] = Test-AuthenticationAuthorization
    $testResults["Secure Coding Practices"] = Test-SecureCodingPractices
    
    # Calculate overall score
    $passedTests = ($testResults.Values | Where-Object { $_ -eq $true }).Count
    $totalTests = $testResults.Count
    $overallScore = ($passedTests / $totalTests) * 100
    
    Write-SecurityLog "" "INFO"
    Write-SecurityLog "Security Validation Summary:" "INFO"
    Write-SecurityLog "===========================" "INFO"
    
    foreach ($test in $testResults.GetEnumerator()) {
        $status = if ($test.Value) { "PASS" } else { "FAIL" }
        $color = if ($test.Value) { "SUCCESS" } else { "WARN" }
        Write-SecurityLog "$($test.Key): $status" $color
    }
    
    Write-SecurityLog "" "INFO"
    Write-SecurityLog "Overall Security Score: $([math]::Round($overallScore, 1))%" "INFO"
    
    if ($overallScore -ge 80) {
        Write-SecurityLog "✅ Security validation PASSED - Good security posture" "SUCCESS"
        $exitCode = 0
    } elseif ($overallScore -ge 60) {
        Write-SecurityLog "⚠️ Security validation PARTIAL - Some security issues found" "WARN"
        $exitCode = 1
    } else {
        Write-SecurityLog "❌ Security validation FAILED - Significant security issues found" "ERROR"
        $exitCode = 2
    }
    
    Write-SecurityRecommendations
    
    Write-SecurityLog "" "INFO"
    Write-SecurityLog "Security validation report saved to: $reportFile" "INFO"
    
    return $exitCode
}

# Execute the security validation
try {
    $exitCode = Start-SecurityValidation
    
    Write-Host "`n🔒 QA System Security Validation Complete" -ForegroundColor Cyan
    Write-Host "Report saved to: $reportFile" -ForegroundColor Green
    
    exit $exitCode
}
catch {
    Write-SecurityLog "Fatal error during security validation: $($_.Exception.Message)" "ERROR"
    Write-Host "❌ Security validation failed with error: $($_.Exception.Message)" -ForegroundColor Red
    exit 3
}