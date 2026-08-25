$ErrorActionPreference = "Continue"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Seeding database..." -ForegroundColor Cyan
& "$root\backend\venv\Scripts\python.exe" -m backend.mock_data.seed_data
if ($LASTEXITCODE -ne 0) {
    Write-Host "Seeding failed! Check your MongoDB connection." -ForegroundColor Red
}

Write-Host "`nStarting Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"Set-Location '$root'; & '.\backend\venv\Scripts\python.exe' -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000`""

Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"Set-Location '$root\frontend'; npm run dev`""

Write-Host "`nBoth servers started in separate windows." -ForegroundColor Yellow
Write-Host "Backend: http://localhost:8000" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Gray
