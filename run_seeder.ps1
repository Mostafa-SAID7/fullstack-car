Write-Host "Starting Database Seeding Process..." -ForegroundColor Cyan

# 1. Build the project
Write-Host "Building project..." -ForegroundColor Yellow
dotnet build src/WebAPI/WebAPI.csproj
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please check the errors above." -ForegroundColor Red
    exit $LASTEXITCODE
}

# 2. Run the seeder
Write-Host "Running seeder..." -ForegroundColor Yellow
dotnet run --project src/WebAPI/WebAPI.csproj -- --seed-database

if ($LASTEXITCODE -ne 0) {
    Write-Host "Seeding failed." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "Seeding process completed successfully!" -ForegroundColor Green
