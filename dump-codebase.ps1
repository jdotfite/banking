# dump-codebase.ps1
# This script creates a focused dump of only the essential source code files

# Name of the final dump file
$destinationFile = "codebase_dump.txt"

# Remove the destination file if it already exists
if (Test-Path $destinationFile) {
    Remove-Item $destinationFile
}

# Only include relevant source code file types
$allowedExtensions = @(".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".html", ".md")

# Get only the essential code files
$files = Get-ChildItem -Recurse -File | Where-Object {
    # Only include files with allowed extensions
    $allowedExtensions -contains $_.Extension -and
    
    # Exclude all build/dependency/config directories
    $_.FullName -notmatch '(\\\.git\\|\\node_modules\\|\\\.next\\|\\out\\|\\build\\|\\dist\\|\\public\\|\\\.vscode\\|\\\.idea\\)' -and
    
    # Exclude test files unless you specifically want them
    $_.FullName -notmatch '(\\__tests__\\|\\test\\|\\tests\\|\.test\.|\.spec\.)' -and
    
    # Exclude any files over 100KB (adjust as needed)
    $_.Length -lt 100KB
}

# Create a counter for files processed
$fileCount = 0
$totalSize = 0

foreach ($file in $files) {
    # Increment counter
    $fileCount++
    $totalSize += $_.Length
    
    # Write a header with the file's relative path (easier to read)
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    Add-Content -Path $destinationFile -Value "==== File: $relativePath ===="
    
    # Append the file's content
    Add-Content -Path $destinationFile -Value (Get-Content $file.FullName -Raw)
    
    # Add spacing between files
    Add-Content -Path $destinationFile -Value "`n`n"
}

# Convert total size to KB
$totalSizeKB = [math]::Round($totalSize / 1KB, 2)

Write-Host "Codebase dump complete:"
Write-Host "- Output file: $destinationFile"
Write-Host "- Files processed: $fileCount"
Write-Host "- Total size: $totalSizeKB KB"