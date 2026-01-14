#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Validates translation files for completeness and consistency.

.DESCRIPTION
    This script validates all translation resource files in the project by:
    - Detecting missing translation keys across languages
    - Validating placeholder consistency (e.g., {{value}})
    - Checking for empty or null values
    - Generating detailed validation reports

.PARAMETER ResourcePath
    Path to the translation resources directory. Defaults to src/WebAPI/Resources

.PARAMETER ReferenceCulture
    The reference culture to compare against. Defaults to en-US

.PARAMETER OutputFormat
    Output format for the report: Console, Json, Html. Defaults to Console

.PARAMETER OutputPath
    Path to save the validation report. Only used when OutputFormat is Json or Html

.EXAMPLE
    .\Validate-Translations.ps1
    
.EXAMPLE
    .\Validate-Translations.ps1 -OutputFormat Json -OutputPath "validation-report.json"
#>

param(
    [Parameter(Mandatory = $false)]
    [string]$ResourcePath = "src/WebAPI/Resources",
    
    [Parameter(Mandatory = $false)]
    [string]$ReferenceCulture = "en-US",
    
    [Parameter(Mandatory = $false)]
    [ValidateSet("Console", "Json", "Html")]
    [string]$OutputFormat = "Console",
    
    [Parameter(Mandatory = $false)]
    [string]$OutputPath = ""
)

# Supported cultures
$SupportedCultures = @("en-US", "ar-EG", "ar-AE", "ar-SA")

# Validation results
$ValidationResults = @{
    TotalFeatures = 0
    TotalKeys = 0
    Issues = @()
    Summary = @{}
}

function Get-TranslationKeys {
    param(
        [Parameter(Mandatory = $true)]
        [PSCustomObject]$JsonObject,
        
        [Parameter(Mandatory = $false)]
        [string]$Prefix = ""
    )
    
    $keys = @()
    
    foreach ($property in $JsonObject.PSObject.Properties) {
        $key = if ($Prefix) { "$Prefix.$($property.Name)" } else { $property.Name }
        
        if ($property.Value -is [PSCustomObject]) {
            # Recursively process nested objects
            $keys += Get-TranslationKeys -JsonObject $property.Value -Prefix $key
        }
        else {
            $keys += $key
        }
    }
    
    return $keys
}

function Get-PlaceholdersFromValue {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Value
    )
    
    $placeholders = @()
    $pattern = '\{\{([^}]+)\}\}'
    
    $matches = [regex]::Matches($Value, $pattern)
    foreach ($match in $matches) {
        $placeholders += $match.Groups[1].Value
    }
    
    return $placeholders
}

function Get-TranslationValue {
    param(
        [Parameter(Mandatory = $true)]
        [PSCustomObject]$JsonObject,
        
        [Parameter(Mandatory = $true)]
        [string]$Key
    )
    
    $parts = $Key -split '\.'
    $current = $JsonObject
    
    foreach ($part in $parts) {
        if ($current.PSObject.Properties.Name -contains $part) {
            $current = $current.$part
        }
        else {
            return $null
        }
    }
    
    return $current
}

function Test-TranslationFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath,
        
        [Parameter(Mandatory = $true)]
        [string]$Culture,
        
        [Parameter(Mandatory = $true)]
        [string]$Feature,
        
        [Parameter(Mandatory = $false)]
        [hashtable]$ReferenceKeys = @{},
        
        [Parameter(Mandatory = $false)]
        [hashtable]$ReferencePlaceholders = @{}
    )
    
    $issues = @()
    
    # Check if file exists
    if (-not (Test-Path $FilePath)) {
        $issues += @{
            Type = "MissingFile"
            Culture = $Culture
            Feature = $Feature
            Message = "Translation file not found: $FilePath"
            Severity = "Critical"
        }
        return $issues
    }
    
    try {
        # Load JSON file
        $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
        $json = $content | ConvertFrom-Json
        
        # Get all keys from this file
        $currentKeys = Get-TranslationKeys -JsonObject $json
        
        # Check for missing keys (compared to reference)
        if ($ReferenceKeys.Count -gt 0) {
            foreach ($refKey in $ReferenceKeys.Keys) {
                if ($currentKeys -notcontains $refKey) {
                    $issues += @{
                        Type = "MissingKey"
                        Culture = $Culture
                        Feature = $Feature
                        Key = $refKey
                        Message = "Missing translation key: $refKey"
                        Severity = "High"
                    }
                }
            }
            
            # Check for extra keys (not in reference)
            foreach ($currentKey in $currentKeys) {
                if ($ReferenceKeys.Keys -notcontains $currentKey) {
                    $issues += @{
                        Type = "ExtraKey"
                        Culture = $Culture
                        Feature = $Feature
                        Key = $currentKey
                        Message = "Extra translation key not in reference: $currentKey"
                        Severity = "Low"
                    }
                }
            }
        }
        
        # Check for empty or null values
        foreach ($key in $currentKeys) {
            $value = Get-TranslationValue -JsonObject $json -Key $key
            
            if ([string]::IsNullOrWhiteSpace($value)) {
                $issues += @{
                    Type = "EmptyValue"
                    Culture = $Culture
                    Feature = $Feature
                    Key = $key
                    Message = "Empty or null translation value for key: $key"
                    Severity = "High"
                }
            }
            else {
                # Check placeholder consistency
                $currentPlaceholders = Get-PlaceholdersFromValue -Value $value
                
                if ($ReferencePlaceholders.ContainsKey($key)) {
                    $refPlaceholders = $ReferencePlaceholders[$key]
                    
                    # Check if placeholders match
                    $missingPlaceholders = $refPlaceholders | Where-Object { $currentPlaceholders -notcontains $_ }
                    $extraPlaceholders = $currentPlaceholders | Where-Object { $refPlaceholders -notcontains $_ }
                    
                    if ($missingPlaceholders.Count -gt 0) {
                        $issues += @{
                            Type = "MissingPlaceholder"
                            Culture = $Culture
                            Feature = $Feature
                            Key = $key
                            Message = "Missing placeholders in translation: $($missingPlaceholders -join ', ')"
                            Severity = "Critical"
                            Details = @{
                                Expected = $refPlaceholders
                                Actual = $currentPlaceholders
                            }
                        }
                    }
                    
                    if ($extraPlaceholders.Count -gt 0) {
                        $issues += @{
                            Type = "ExtraPlaceholder"
                            Culture = $Culture
                            Feature = $Feature
                            Key = $key
                            Message = "Extra placeholders in translation: $($extraPlaceholders -join ', ')"
                            Severity = "Medium"
                            Details = @{
                                Expected = $refPlaceholders
                                Actual = $currentPlaceholders
                            }
                        }
                    }
                }
            }
        }
        
    }
    catch {
        $issues += @{
            Type = "ParseError"
            Culture = $Culture
            Feature = $Feature
            Message = "Failed to parse JSON file: $($_.Exception.Message)"
            Severity = "Critical"
        }
    }
    
    return $issues
}

function Get-FeatureDirectories {
    param(
        [Parameter(Mandatory = $true)]
        [string]$BasePath
    )
    
    $features = @()
    
    # Recursively find all directories containing translation files
    $translationFiles = Get-ChildItem -Path $BasePath -Filter "$ReferenceCulture.json" -Recurse
    
    foreach ($file in $translationFiles) {
        $featurePath = $file.Directory.FullName
        $relativePath = $featurePath.Replace($BasePath, "").TrimStart('\', '/')
        
        $features += @{
            Name = $relativePath -replace '[/\\]', '.'
            Path = $featurePath
            RelativePath = $relativePath
        }
    }
    
    return $features
}

function Format-ConsoleOutput {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Results
    )
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  Translation Validation Report" -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "Total Features Validated: $($Results.TotalFeatures)" -ForegroundColor White
    Write-Host "Total Translation Keys: $($Results.TotalKeys)" -ForegroundColor White
    Write-Host "Total Issues Found: $($Results.Issues.Count)`n" -ForegroundColor $(if ($Results.Issues.Count -eq 0) { "Green" } else { "Yellow" })
    
    if ($Results.Issues.Count -eq 0) {
        Write-Host "✓ All translations are valid and complete!" -ForegroundColor Green
        return
    }
    
    # Group issues by severity
    $critical = $Results.Issues | Where-Object { $_.Severity -eq "Critical" }
    $high = $Results.Issues | Where-Object { $_.Severity -eq "High" }
    $medium = $Results.Issues | Where-Object { $_.Severity -eq "Medium" }
    $low = $Results.Issues | Where-Object { $_.Severity -eq "Low" }
    
    Write-Host "Issues by Severity:" -ForegroundColor White
    Write-Host "  Critical: $($critical.Count)" -ForegroundColor Red
    Write-Host "  High: $($high.Count)" -ForegroundColor DarkRed
    Write-Host "  Medium: $($medium.Count)" -ForegroundColor Yellow
    Write-Host "  Low: $($low.Count)`n" -ForegroundColor Gray
    
    # Group issues by type
    $issuesByType = $Results.Issues | Group-Object -Property Type
    
    Write-Host "Issues by Type:" -ForegroundColor White
    foreach ($group in $issuesByType) {
        Write-Host "  $($group.Name): $($group.Count)" -ForegroundColor Cyan
    }
    
    Write-Host "`n----------------------------------------" -ForegroundColor Gray
    Write-Host "Detailed Issues:" -ForegroundColor White
    Write-Host "----------------------------------------`n" -ForegroundColor Gray
    
    # Display critical issues first
    if ($critical.Count -gt 0) {
        Write-Host "CRITICAL ISSUES:" -ForegroundColor Red
        foreach ($issue in $critical) {
            Write-Host "  [$($issue.Culture)] $($issue.Feature)" -ForegroundColor Red
            Write-Host "    Type: $($issue.Type)" -ForegroundColor Red
            if ($issue.Key) {
                Write-Host "    Key: $($issue.Key)" -ForegroundColor Red
            }
            Write-Host "    Message: $($issue.Message)" -ForegroundColor Red
            Write-Host ""
        }
    }
    
    # Display high severity issues
    if ($high.Count -gt 0) {
        Write-Host "HIGH SEVERITY ISSUES:" -ForegroundColor DarkRed
        foreach ($issue in $high) {
            Write-Host "  [$($issue.Culture)] $($issue.Feature)" -ForegroundColor DarkRed
            Write-Host "    Type: $($issue.Type)" -ForegroundColor DarkRed
            if ($issue.Key) {
                Write-Host "    Key: $($issue.Key)" -ForegroundColor DarkRed
            }
            Write-Host "    Message: $($issue.Message)" -ForegroundColor DarkRed
            Write-Host ""
        }
    }
    
    # Display medium severity issues (limited to first 10)
    if ($medium.Count -gt 0) {
        Write-Host "MEDIUM SEVERITY ISSUES (showing first 10):" -ForegroundColor Yellow
        $displayCount = [Math]::Min(10, $medium.Count)
        for ($i = 0; $i -lt $displayCount; $i++) {
            $issue = $medium[$i]
            Write-Host "  [$($issue.Culture)] $($issue.Feature)" -ForegroundColor Yellow
            Write-Host "    Type: $($issue.Type)" -ForegroundColor Yellow
            if ($issue.Key) {
                Write-Host "    Key: $($issue.Key)" -ForegroundColor Yellow
            }
            Write-Host "    Message: $($issue.Message)" -ForegroundColor Yellow
            Write-Host ""
        }
        if ($medium.Count -gt 10) {
            Write-Host "  ... and $($medium.Count - 10) more medium severity issues`n" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n========================================`n" -ForegroundColor Cyan
}

function Export-JsonReport {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Results,
        
        [Parameter(Mandatory = $true)]
        [string]$OutputPath
    )
    
    $Results | ConvertTo-Json -Depth 10 | Out-File -FilePath $OutputPath -Encoding UTF8
    Write-Host "JSON report saved to: $OutputPath" -ForegroundColor Green
}

function Export-HtmlReport {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Results,
        
        [Parameter(Mandatory = $true)]
        [string]$OutputPath
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $totalFeatures = $Results.TotalFeatures
    $totalKeys = $Results.TotalKeys
    $totalIssues = $Results.Issues.Count
    
    $htmlBuilder = [System.Text.StringBuilder]::new()
    [void]$htmlBuilder.AppendLine('<!DOCTYPE html>')
    [void]$htmlBuilder.AppendLine('<html lang="en">')
    [void]$htmlBuilder.AppendLine('<head>')
    [void]$htmlBuilder.AppendLine('    <meta charset="UTF-8">')
    [void]$htmlBuilder.AppendLine('    <meta name="viewport" content="width=device-width, initial-scale=1.0">')
    [void]$htmlBuilder.AppendLine('    <title>Translation Validation Report</title>')
    [void]$htmlBuilder.AppendLine('    <style>')
    [void]$htmlBuilder.AppendLine('        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }')
    [void]$htmlBuilder.AppendLine('        .container { max-width: 1200px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }')
    [void]$htmlBuilder.AppendLine('        h1 { color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px; }')
    [void]$htmlBuilder.AppendLine('        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }')
    [void]$htmlBuilder.AppendLine('        .summary-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }')
    [void]$htmlBuilder.AppendLine('        .summary-card h3 { margin: 0 0 10px 0; font-size: 14px; opacity: 0.9; }')
    [void]$htmlBuilder.AppendLine('        .summary-card .value { font-size: 32px; font-weight: bold; }')
    [void]$htmlBuilder.AppendLine('        .severity-critical { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }')
    [void]$htmlBuilder.AppendLine('        .severity-high { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }')
    [void]$htmlBuilder.AppendLine('        .severity-medium { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; }')
    [void]$htmlBuilder.AppendLine('        .severity-low { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; }')
    [void]$htmlBuilder.AppendLine('        .issues { margin-top: 30px; }')
    [void]$htmlBuilder.AppendLine('        .issue { background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 10px 0; border-radius: 4px; }')
    [void]$htmlBuilder.AppendLine('        .issue.critical { border-left-color: #dc3545; }')
    [void]$htmlBuilder.AppendLine('        .issue.high { border-left-color: #fd7e14; }')
    [void]$htmlBuilder.AppendLine('        .issue.medium { border-left-color: #ffc107; }')
    [void]$htmlBuilder.AppendLine('        .issue.low { border-left-color: #6c757d; }')
    [void]$htmlBuilder.AppendLine('        .issue-header { font-weight: bold; color: #333; margin-bottom: 5px; }')
    [void]$htmlBuilder.AppendLine('        .issue-detail { color: #666; font-size: 14px; margin: 5px 0; }')
    [void]$htmlBuilder.AppendLine('        .badge { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }')
    [void]$htmlBuilder.AppendLine('        .badge-critical { background-color: #dc3545; color: white; }')
    [void]$htmlBuilder.AppendLine('        .badge-high { background-color: #fd7e14; color: white; }')
    [void]$htmlBuilder.AppendLine('        .badge-medium { background-color: #ffc107; color: #333; }')
    [void]$htmlBuilder.AppendLine('        .badge-low { background-color: #6c757d; color: white; }')
    [void]$htmlBuilder.AppendLine('        .success { color: #28a745; font-size: 18px; font-weight: bold; text-align: center; padding: 20px; }')
    [void]$htmlBuilder.AppendLine('    </style>')
    [void]$htmlBuilder.AppendLine('</head>')
    [void]$htmlBuilder.AppendLine('<body>')
    [void]$htmlBuilder.AppendLine('    <div class="container">')
    [void]$htmlBuilder.AppendLine('        <h1>Translation Validation Report</h1>')
    [void]$htmlBuilder.AppendLine("        <p>Generated: $timestamp</p>")
    [void]$htmlBuilder.AppendLine('        <div class="summary">')
    [void]$htmlBuilder.AppendLine('            <div class="summary-card">')
    [void]$htmlBuilder.AppendLine('                <h3>Total Features</h3>')
    [void]$htmlBuilder.AppendLine("                <div class='value'>$totalFeatures</div>")
    [void]$htmlBuilder.AppendLine('            </div>')
    [void]$htmlBuilder.AppendLine('            <div class="summary-card">')
    [void]$htmlBuilder.AppendLine('                <h3>Total Keys</h3>')
    [void]$htmlBuilder.AppendLine("                <div class='value'>$totalKeys</div>")
    [void]$htmlBuilder.AppendLine('            </div>')
    [void]$htmlBuilder.AppendLine('            <div class="summary-card">')
    [void]$htmlBuilder.AppendLine('                <h3>Total Issues</h3>')
    [void]$htmlBuilder.AppendLine("                <div class='value'>$totalIssues</div>")
    [void]$htmlBuilder.AppendLine('            </div>')
    [void]$htmlBuilder.AppendLine('        </div>')
    
    if ($Results.Issues.Count -eq 0) {
        [void]$htmlBuilder.AppendLine('        <div class="success">✓ All translations are valid and complete!</div>')
    }
    else {
        $critical = $Results.Issues | Where-Object { $_.Severity -eq "Critical" }
        $high = $Results.Issues | Where-Object { $_.Severity -eq "High" }
        $medium = $Results.Issues | Where-Object { $_.Severity -eq "Medium" }
        $low = $Results.Issues | Where-Object { $_.Severity -eq "Low" }
        
        [void]$htmlBuilder.AppendLine('        <div class="summary">')
        [void]$htmlBuilder.AppendLine('            <div class="summary-card severity-critical">')
        [void]$htmlBuilder.AppendLine('                <h3>Critical Issues</h3>')
        [void]$htmlBuilder.AppendLine("                <div class='value'>$($critical.Count)</div>")
        [void]$htmlBuilder.AppendLine('            </div>')
        [void]$htmlBuilder.AppendLine('            <div class="summary-card severity-high">')
        [void]$htmlBuilder.AppendLine('                <h3>High Severity</h3>')
        [void]$htmlBuilder.AppendLine("                <div class='value'>$($high.Count)</div>")
        [void]$htmlBuilder.AppendLine('            </div>')
        [void]$htmlBuilder.AppendLine('            <div class="summary-card severity-medium">')
        [void]$htmlBuilder.AppendLine('                <h3>Medium Severity</h3>')
        [void]$htmlBuilder.AppendLine("                <div class='value'>$($medium.Count)</div>")
        [void]$htmlBuilder.AppendLine('            </div>')
        [void]$htmlBuilder.AppendLine('            <div class="summary-card severity-low">')
        [void]$htmlBuilder.AppendLine('                <h3>Low Severity</h3>')
        [void]$htmlBuilder.AppendLine("                <div class='value'>$($low.Count)</div>")
        [void]$htmlBuilder.AppendLine('            </div>')
        [void]$htmlBuilder.AppendLine('        </div>')
        [void]$htmlBuilder.AppendLine('        <div class="issues">')
        [void]$htmlBuilder.AppendLine('            <h2>Detailed Issues</h2>')
        
        foreach ($issue in $Results.Issues) {
            $severityClass = $issue.Severity.ToLower()
            [void]$htmlBuilder.AppendLine("            <div class='issue $severityClass'>")
            [void]$htmlBuilder.AppendLine("                <div class='issue-header'>")
            [void]$htmlBuilder.AppendLine("                    <span class='badge badge-$severityClass'>$($issue.Severity)</span>")
            [void]$htmlBuilder.AppendLine("                    [$($issue.Culture)] $($issue.Feature)")
            [void]$htmlBuilder.AppendLine('                </div>')
            [void]$htmlBuilder.AppendLine("                <div class='issue-detail'><strong>Type:</strong> $($issue.Type)</div>")
            if ($issue.Key) {
                [void]$htmlBuilder.AppendLine("                <div class='issue-detail'><strong>Key:</strong> $($issue.Key)</div>")
            }
            [void]$htmlBuilder.AppendLine("                <div class='issue-detail'><strong>Message:</strong> $($issue.Message)</div>")
            [void]$htmlBuilder.AppendLine('            </div>')
        }
        
        [void]$htmlBuilder.AppendLine('        </div>')
    }
    
    [void]$htmlBuilder.AppendLine('    </div>')
    [void]$htmlBuilder.AppendLine('</body>')
    [void]$htmlBuilder.AppendLine('</html>')
    
    $htmlBuilder.ToString() | Out-File -FilePath $OutputPath -Encoding UTF8
    Write-Host "HTML report saved to: $OutputPath" -ForegroundColor Green
}

# Main execution
Write-Host "Starting translation validation..." -ForegroundColor Cyan
Write-Host "Resource Path: $ResourcePath" -ForegroundColor Gray
Write-Host "Reference Culture: $ReferenceCulture" -ForegroundColor Gray
Write-Host "Supported Cultures: $($SupportedCultures -join ', ')`n" -ForegroundColor Gray

# Check if resource path exists
if (-not (Test-Path $ResourcePath)) {
    Write-Host "Error: Resource path not found: $ResourcePath" -ForegroundColor Red
    exit 1
}

# Get all feature directories
$features = Get-FeatureDirectories -BasePath $ResourcePath
$ValidationResults.TotalFeatures = $features.Count

Write-Host "Found $($features.Count) features to validate`n" -ForegroundColor Green

# Process each feature
foreach ($feature in $features) {
    Write-Host "Validating feature: $($feature.Name)" -ForegroundColor Cyan
    
    # Load reference culture first
    $referenceFile = Join-Path $feature.Path "$ReferenceCulture.json"
    
    if (-not (Test-Path $referenceFile)) {
        $ValidationResults.Issues += @{
            Type = "MissingReferenceFile"
            Culture = $ReferenceCulture
            Feature = $feature.Name
            Message = "Reference culture file not found: $referenceFile"
            Severity = "Critical"
        }
        continue
    }
    
    # Load reference keys and placeholders
    $referenceContent = Get-Content -Path $referenceFile -Raw -Encoding UTF8
    $referenceJson = $referenceContent | ConvertFrom-Json
    $referenceKeys = Get-TranslationKeys -JsonObject $referenceJson
    $ValidationResults.TotalKeys += $referenceKeys.Count
    
    # Build reference placeholders map
    $referencePlaceholders = @{}
    foreach ($key in $referenceKeys) {
        $value = Get-TranslationValue -JsonObject $referenceJson -Key $key
        if ($value) {
            $placeholders = Get-PlaceholdersFromValue -Value $value
            if ($placeholders.Count -gt 0) {
                $referencePlaceholders[$key] = $placeholders
            }
        }
    }
    
    # Convert to hashtable for faster lookup
    $referenceKeysHash = @{}
    foreach ($key in $referenceKeys) {
        $referenceKeysHash[$key] = $true
    }
    
    # Validate each supported culture
    foreach ($culture in $SupportedCultures) {
        if ($culture -eq $ReferenceCulture) {
            continue  # Skip reference culture
        }
        
        $cultureFile = Join-Path $feature.Path "$culture.json"
        $issues = Test-TranslationFile -FilePath $cultureFile -Culture $culture -Feature $feature.Name -ReferenceKeys $referenceKeysHash -ReferencePlaceholders $referencePlaceholders
        
        if ($issues.Count -gt 0) {
            $ValidationResults.Issues += $issues
        }
    }
}

# Generate output based on format
switch ($OutputFormat) {
    "Console" {
        Format-ConsoleOutput -Results $ValidationResults
    }
    "Json" {
        if ([string]::IsNullOrWhiteSpace($OutputPath)) {
            $OutputPath = "translation-validation-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
        }
        Export-JsonReport -Results $ValidationResults -OutputPath $OutputPath
        Format-ConsoleOutput -Results $ValidationResults
    }
    "Html" {
        if ([string]::IsNullOrWhiteSpace($OutputPath)) {
            $OutputPath = "translation-validation-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').html"
        }
        Export-HtmlReport -Results $ValidationResults -OutputPath $OutputPath
        Format-ConsoleOutput -Results $ValidationResults
    }
}

# Exit with appropriate code
if ($ValidationResults.Issues.Count -eq 0) {
    exit 0
}
else {
    $criticalCount = ($ValidationResults.Issues | Where-Object { $_.Severity -eq "Critical" }).Count
    if ($criticalCount -gt 0) {
        exit 2  # Critical issues found
    }
    else {
        exit 1  # Non-critical issues found
    }
}
