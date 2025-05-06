# Restart the Next.js development server
Write-Host "Stopping any running Next.js development servers..." -ForegroundColor Yellow
$nextProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" }
if ($nextProcesses) {
    $nextProcesses | ForEach-Object { 
        Write-Host "Stopping process $($_.Id)..." -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force 
    }
    Write-Host "All Next.js processes stopped." -ForegroundColor Green
} else {
    Write-Host "No running Next.js processes found." -ForegroundColor Cyan
}

# Clear Next.js cache
Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "Next.js cache cleared." -ForegroundColor Green
} else {
    Write-Host "No .next directory found." -ForegroundColor Cyan
}

# Start the development server
Write-Host "Starting Next.js development server..." -ForegroundColor Yellow
Write-Host "Please run 'npm run dev' manually to start the server." -ForegroundColor Green
Write-Host "Development server setup complete." -ForegroundColor Green
