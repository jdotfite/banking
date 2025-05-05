# dump-codebase.ps1 
# This script creates a focused dump of only the essential source code files
# – with visual progress feedback as it runs.

# Name of the final dump file
$destinationFile = "codebase_dump.txt"

# Remove the destination file if it already exists
if (Test-Path $destinationFile) {
    Remove-Item $destinationFile
}

# Only include relevant source code file types
$allowedExtensions = @(".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".html", ".md")

# Get only the essential code files (public is now included)
$files = Get-ChildItem -Recurse -File | Where-Object {
    $allowedExtensions -contains $_.Extension -and
    $_.FullName -notmatch '(\\\.git\\|\\node_modules\\|\\\.next\\|\\out\\|\\build\\|\\dist\\|\\\.vscode\\|\\\.idea\\)' -and
    $_.FullName -notmatch '(\\__tests__\\|\\test\\|\\tests\\|\.test\.|\.spec\.)' -and
    $_.Length -lt 100KB
}

# Prep progress tracking
$totalFiles = $files.Count
$fileCount  = 0
$totalSize  = 0

foreach ($file in $files) {
    $fileCount++
    $totalSize += $file.Length

    # Calculate percent complete
    $percent = [int](($fileCount / $totalFiles) * 100)

    # Show a progress bar
    Write-Progress `
      -Activity "Dumping codebase" `
      -Status "[$fileCount/$totalFiles] $($file.Name)" `
      -PercentComplete $percent

    # (Optional) also echo each file to the console
    Write-Host "→ Processing $($file.FullName)" -ForegroundColor DarkGray

    # Write header + contents
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    Add-Content -Path $destinationFile -Value "==== File: $relativePath ===="
    Add-Content -Path $destinationFile -Value (Get-Content $file.FullName -Raw)
    Add-Content -Path $destinationFile -Value "`n`n"
}

# Final summary (clears the progress bar first)
Write-Progress -Activity "Dumping codebase" -Completed

$totalSizeKB = [math]::Round($totalSize / 1KB, 2)
Write-Host "✅ Codebase dump complete!"
Write-Host "   • Output file: $destinationFile"
Write-Host "   • Files processed: $fileCount"
Write-Host "   • Total size: $totalSizeKB KB"
