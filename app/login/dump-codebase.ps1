# dump-codebase.ps1
# This script traverses the codebase recursively and dumps the content of each file
# into a single text file with headers showing the file path. It excludes:
#   - Files in the .git directory
#   - Files in the node_modules directory
#   - package.json and package-lock.json files

# Name of the final dump file
$destinationFile = "codebase_dump.txt"

# Remove the destination file if it already exists
if (Test-Path $destinationFile) {
    Remove-Item $destinationFile
}

# Get all files recursively in the current directory, excluding unwanted directories/files.
$files = Get-ChildItem -Recurse -File | Where-Object {
    $_.FullName -notmatch '\\.git\\' -and `
    $_.FullName -notmatch '\\node_modules\\' -and `
    $_.Name -ne "package.json" -and `
    $_.Name -ne "package-lock.json"
}

foreach ($file in $files) {
    # Write a header with the file's full path
    Add-Content -Path $destinationFile -Value "==== File: $($file.FullName) ===="
    # Append the file's content (as a single string)
    Add-Content -Path $destinationFile -Value (Get-Content $file.FullName -Raw)
    # Add extra spacing between files
    Add-Content -Path $destinationFile -Value "`n`n"
}

Write-Host "Codebase dumped to $destinationFile."
