# Simple PowerShell script to replace all localhost URLs
# Run: powershell .\scripts\replace-urls.ps1

Write-Host "Replacing localhost URLs with API_BASE_URL..." -ForegroundColor Cyan

$baseDir = "x:\desgin\Eruditio-main\src"

Get-ChildItem -Path $baseDir -Include *.jsx,*.js -Recurse | ForEach-Object {
    $file = $_
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Replace all localhost:5006 references with API_BASE_URL
    $content = $content -replace 'http://localhost:5006', '${API_BASE_URL}'
    $content = $content -replace '"http://localhost:5006', '"${API_BASE_URL}'
    $content = $content -replace "'http://localhost:5006", "'`${API_BASE_URL}"
    $content = $content -replace '`http://localhost:5006', '`${API_BASE_URL}'
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "✅ Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`n✨ Done! Remember to add API_BASE_URL import where needed." -ForegroundColor Green
