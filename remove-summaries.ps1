#!/usr/bin/env pwsh

# Script to remove XML summary comments from ALL C# controllers
# This removes /// <summary> blocks and their content

$controllersPath = "c:\Users\memos\OneDrive\Desktop\Projects\fully2car\src\WebAPI\Controllers"

# Find all controller files recursively
$controllerFiles = Get-ChildItem -Path $controllersPath -Filter "*Controller.cs" -Recurse

Write-Host "Found $($controllerFiles.Count) controller files to process"

foreach ($file in $controllerFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    $content = Get-Content -Path $file.FullName -Raw
    
    # Remove summary blocks with their content
    # Pattern matches:
    # - Optional whitespace/indentation
    # - /// <summary>
    # - Any content (including newlines)
    # - /// </summary>
    # - Trailing newline
    $cleaned = $content -replace '(?m)^\s*///\s*<summary>.*?^\s*///\s*</summary>\r?\n', ''
    
    # Also remove standalone param/returns/etc XML doc comments
    $cleaned = $cleaned -replace '(?m)^\s*///\s*<param.*?>\r?\n', ''
    $cleaned = $cleaned -replace '(?m)^\s*///\s*<returns>.*?</returns>\r?\n', ''
    $cleaned = $cleaned -replace '(?m)^\s*///\s*<remarks>.*?</remarks>\r?\n', ''
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $cleaned -NoNewline
    
    Write-Host "  ✓ Completed: $($file.Name)"
}

Write-Host "`n✓ Cleanup complete! Processed $($controllerFiles.Count) files."
