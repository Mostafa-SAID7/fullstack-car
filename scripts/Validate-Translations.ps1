param(
    [string]$ResourcePath = "src/WebAPI/Resources"
)

Write-Host "Translation Validation Report" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

$cultures = @("en-US", "ar-EG", "ar-AE", "ar-SA")
$totalFiles = 0
$validFiles = 0
$missingFiles = 0

# Get all translation files
$allFiles = Get-ChildItem -Path $ResourcePath -Recurse -Filter "*.json" | Where-Object {
    $_.Name -match "^(en-US|ar-EG|ar-AE|ar-SA)\.json$"
}

Write-Host "Found $($allFiles.Count) translation files" -ForegroundColor Green

# Group by directory
$directories = $allFiles | Group-Object DirectoryName

foreach ($dir in $directories) {
    $relativePath = $dir.Name.Replace((Resolve-Path $ResourcePath).Path, "").TrimStart('\')
    Write-Host "`nFeature: $relativePath" -ForegroundColor Yellow
    
    $filesInDir = $dir.Group
    foreach ($culture in $cultures) {
        $file = $filesInDir | Where-Object { $_.Name -eq "$culture.json" }
        if ($file) {
            Write-Host "  ✓ $culture" -ForegroundColor Green
            $validFiles++
        } else {
            Write-Host "  ✗ $culture (missing)" -ForegroundColor Red
            $missingFiles++
        }
        $totalFiles++
    }
}

$expectedFiles = $directories.Count * $cultures.Count
$completionRate = [math]::Round(($validFiles / $expectedFiles) * 100, 1)

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "Valid files: $validFiles" -ForegroundColor Green
Write-Host "Missing files: $missingFiles" -ForegroundColor Red
Write-Host "Completion rate: $completionRate%" -ForegroundColor Yellow

if ($missingFiles -eq 0) {
    Write-Host "`n✓ All translation files are present!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n✗ Some translation files are missing" -ForegroundColor Red
    exit 1
}