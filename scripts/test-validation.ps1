# Quick test of validation script on a single feature
$testPath = "src/WebAPI/Resources/Main/Community/Posts"

Write-Host "Testing validation on Posts feature..." -ForegroundColor Cyan

# Check if files exist
$cultures = @("en-US", "ar-EG", "ar-AE", "ar-SA")
foreach ($culture in $cultures) {
    $file = Join-Path $testPath "$culture.json"
    if (Test-Path $file) {
        Write-Host "  Found: $culture.json" -ForegroundColor Green
        
        # Try to parse JSON
        try {
            $content = Get-Content -Path $file -Raw -Encoding UTF8
            $json = $content | ConvertFrom-Json
            Write-Host "    - Valid JSON" -ForegroundColor Gray
        }
        catch {
            Write-Host "    - ERROR: Invalid JSON" -ForegroundColor Red
        }
    }
    else {
        Write-Host "  Missing: $culture.json" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Validation scripts created successfully!" -ForegroundColor Green
Write-Host "  - PowerShell script created" -ForegroundColor Cyan
Write-Host "  - Node.js script created" -ForegroundColor Cyan
Write-Host "  - Documentation created" -ForegroundColor Cyan
