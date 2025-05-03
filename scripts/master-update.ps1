# Master script to run all updates

Write-Host "Starting Banking App Integration Updates..."

# Create Preloader Config
New-Item -Path "./lib/config" -ItemType Directory -Force
Invoke-Expression -Command "$(Get-Content ./scripts/update-preloader-config.ps1)"

# Update Types
Invoke-Expression -Command "$(Get-Content ./scripts/update-types.ps1)"

# Update App Entry Point
New-Item -Path "./pages" -ItemType Directory -Force
Invoke-Expression -Command "$(Get-Content ./scripts/update-app-entry.ps1)"

# Update Components
Invoke-Expression -Command "$(Get-Content ./scripts/update-home-component.ps1)"
Invoke-Expression -Command "$(Get-Content ./scripts/update-transaction-list.ps1)"
Invoke-Expression -Command "$(Get-Content ./scripts/update-credit-card.ps1)"
Invoke-Expression -Command "$(Get-Content ./scripts/update-banking-preloader.ps1)"

# Install Dependencies
Invoke-Expression -Command "$(Get-Content ./install-banking-deps.ps1)"

Write-Host "? All updates completed successfully! Your banking app is ready to use preloaders and fake data."
