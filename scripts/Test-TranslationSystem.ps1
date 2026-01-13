param(
    [string]$ResourcePath = "src/WebAPI/Resources"
)

Write-Host "Testing Translation System Functionality" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Test 1: Check if all required translation files exist
Write-Host "`n1. Checking translation file completeness..." -ForegroundColor Yellow

$cultures = @("en-US", "ar-EG", "ar-AE", "ar-SA")
$features = @("Posts", "Groups", "QA", "Reviews", "Social", "Maps", "News", "Guides")
$allFilesExist = $true
$totalFiles = 0
$existingFiles = 0

foreach ($feature in $features) {
    $featurePath = Join-Path $ResourcePath "Main/Community/$feature"
    Write-Host "  Feature: $feature" -ForegroundColor Cyan
    
    foreach ($culture in $cultures) {
        $filePath = Join-Path $featurePath "$culture.json"
        $totalFiles++
        if (Test-Path $filePath) {
            Write-Host "    OK: $culture" -ForegroundColor Green
            $existingFiles++
        } else {
            Write-Host "    MISSING: $culture" -ForegroundColor Red
            $allFilesExist = $false
        }
    }
}

# Test 2: Validate JSON structure
Write-Host "`n2. Validating JSON structure..." -ForegroundColor Yellow

$jsonValid = $true
$validJsonFiles = 0
$totalJsonFiles = 0

foreach ($feature in $features) {
    $featurePath = Join-Path $ResourcePath "Main/Community/$feature"
    
    foreach ($culture in $cultures) {
        $filePath = Join-Path $featurePath "$culture.json"
        if (Test-Path $filePath) {
            $totalJsonFiles++
            try {
                $content = Get-Content -Path $filePath -Raw -Encoding UTF8
                $json = $content | ConvertFrom-Json
                Write-Host "    OK: $feature/$culture.json" -ForegroundColor Green
                $validJsonFiles++
            }
            catch {
                Write-Host "    ERROR: $feature/$culture.json - $($_.Exception.Message)" -ForegroundColor Red
                $jsonValid = $false
            }
        }
    }
}

# Test 3: Sample content validation
Write-Host "`n3. Sample content validation..." -ForegroundColor Yellow

$sampleFeature = "Posts"
$samplePath = Join-Path $ResourcePath "Main/Community/$sampleFeature"
$contentValid = $true

foreach ($culture in $cultures) {
    $filePath = Join-Path $samplePath "$culture.json"
    if (Test-Path $filePath) {
        try {
            $content = Get-Content -Path $filePath -Raw -Encoding UTF8
            $json = $content | ConvertFrom-Json
            
            # Check for some expected structure
            if ($json.posts -and $json.posts.title) {
                Write-Host "  OK: $culture - Has expected content structure" -ForegroundColor Green
            } else {
                Write-Host "  WARNING: $culture - Missing expected content structure" -ForegroundColor Yellow
                $contentValid = $false
            }
        }
        catch {
            Write-Host "  ERROR: $culture - Error validating content" -ForegroundColor Red
            $contentValid = $false
        }
    }
}

# Summary
Write-Host "`nTEST SUMMARY" -ForegroundColor Cyan
Write-Host "============" -ForegroundColor Cyan

Write-Host "Files: $existingFiles/$totalFiles exist" -ForegroundColor White
Write-Host "JSON: $validJsonFiles/$totalJsonFiles valid" -ForegroundColor White

if ($allFilesExist) {
    Write-Host "File Completeness: PASS" -ForegroundColor Green
} else {
    Write-Host "File Completeness: FAIL" -ForegroundColor Red
}

if ($jsonValid) {
    Write-Host "JSON Validity: PASS" -ForegroundColor Green
} else {
    Write-Host "JSON Validity: FAIL" -ForegroundColor Red
}

if ($contentValid) {
    Write-Host "Content Structure: PASS" -ForegroundColor Green
} else {
    Write-Host "Content Structure: PARTIAL" -ForegroundColor Yellow
}

$overallStatus = $allFilesExist -and $jsonValid
if ($overallStatus) {
    Write-Host "`nTranslation system validation: PASSED" -ForegroundColor Green
    Write-Host "The translation infrastructure is ready for use!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nTranslation system validation: NEEDS ATTENTION" -ForegroundColor Yellow
    Write-Host "Some issues were found that should be addressed." -ForegroundColor Yellow
    exit 1
}