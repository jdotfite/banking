# PowerShell script to run the fix-sw-and-restart.js script
Write-Host "Running service worker fix and server restart script..." -ForegroundColor Cyan

# Get the directory of this script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir

# Path to the Node.js script
$jsScriptPath = Join-Path -Path $scriptDir -ChildPath "fix-sw-and-restart.js"

# Check if the script exists
if (-not (Test-Path $jsScriptPath)) {
    Write-Host "Error: Script not found at $jsScriptPath" -ForegroundColor Red
    exit 1
}

# Run the Node.js script
try {
    Write-Host "Executing $jsScriptPath..." -ForegroundColor Yellow
    node $jsScriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Script executed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Script execution failed with exit code $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "Error executing script: $_" -ForegroundColor Red
    exit 1
}
