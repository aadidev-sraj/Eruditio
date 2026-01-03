# PowerShell script to replace hardcoded localhost URLs with API configuration
# Run this with: powershell -ExecutionPolicy Bypass -File scripts/update-api-urls.ps1

Write-Host "Starting API URL replacement..." -ForegroundColor Cyan
Write-Host ""

$replacements = @(
    @{
        File = "src\Pages\ForgotPassword\ForgotPassword.jsx"
        Find = "'http://localhost:5006/api/auth/forgot-password'"
        Replace = "API_ENDPOINTS.AUTH_FORGOT_PASSWORD"
        Import = "import { API_ENDPOINTS } from '../../config/api'"
    },
    @{
        File = "src\Pages\Profile\Profile.jsx"
        Find = '"http://localhost:5006/api/profile"'
        Replace = "API_ENDPOINTS.PROFILE"
        Import = "import { API_ENDPOINTS } from '../../config/api'"
    },
    @{
        File = "src\Pages\Dashboard\Dashboard.jsx"
        Find = '"http://localhost:5006/api/profile"', '"http://localhost:5006/api/courses/search'
        Replace = "API_ENDPOINTS.PROFILE", "API_ENDPOINTS.COURSES_SEARCH"
        Import = "import { API_ENDPOINTS, getApiUrl } from '../../config/api'"
    },
    @{
        File = "src\Pages\MyLearnings\MyLearnings.jsx"
        Find = '"http://localhost:5006/api/enrollments"', '`http://localhost:5006/api/enrollments/'
        Replace = "API_ENDPOINTS.ENROLLMENTS", '`${API_ENDPOINTS.ENROLLMENTS}/'
        Import = "import { API_ENDPOINTS } from '../../config/api'"
    },
    @{
        File = "src\Pages\MyCourses\MyCourses.jsx"
        Find = '"http://localhost:5006/api/courses/instructor"', '`http://localhost:5006/api/courses/', '`http://localhost:5006$'
        Replace = "API_ENDPOINTS.COURSES_INSTRUCTOR", '`${API_ENDPOINTS.COURSES}/', '`${API_BASE_URL}$'
        Import = "import { API_ENDPOINTS, API_BASE_URL } from '../../config/api'"
    },
    @{
        File = "src\Pages\Assignment\Assignments.jsx"
        Find = '"http://localhost:5006/api/enrollments"'
        Replace = "API_ENDPOINTS.ENROLLMENTS"
        Import = "import { API_ENDPOINTS } from '../../config/api'"
    },
    @{
        File = "src\Pages\Assignment\CourseAssignments.jsx"
        Find = '`http://localhost:5006/api/courses/', '`http://localhost:5006/api/assignments/'
        Replace = '`${API_ENDPOINTS.COURSES}/', '`${API_ENDPOINTS.ASSIGNMENTS}/'
        Import = "import { API_ENDPOINTS } from '../../config/api'"
    },
    @{
        File = "src\Pages\AddCourses\AddCourse.jsx"
        Find = '`http://localhost:5006/api/upload/', '"http://localhost:5006/api/courses"'
        Replace = '`${API_ENDPOINTS.UPLOAD}/', 'API_ENDPOINTS.COURSES'
        Import = "import { API_ENDPOINTS } from '../../config/api'"
    },
    @{
        File = "src\Components\Homepage\Homepage.jsx"
        Find = '`http://localhost:5006/api/youtube/search?q=$'
        Replace = '`${API_ENDPOINTS.YOUTUBE_SEARCH}?q=$'
        Import = "import { API_ENDPOINTS } from '../../config/api'"
    },
    @{
        File = "src\Components\CourseView\CourseView.jsx"
        Find = '`http://localhost:5006/api/', '`http://localhost:5006/api/courses/', '`http://localhost:5006/api/assignments/', '`http://localhost:5006/api/enrollments/'
        Replace = '`${API_BASE_URL}/api/', '`${API_ENDPOINTS.COURSES}/', '`${API_ENDPOINTS.ASSIGNMENTS}/', '`${API_ENDPOINTS.ENROLLMENTS}/'
        Import = "import { API_ENDPOINTS, API_BASE_URL } from '../../config/api'"
    },
    @{
        File = "src\Components\Assignment\Assignment.jsx"
        Find = '`http://localhost:5006/api/assignments/'
        Replace = '`${API_ENDPOINTS.ASSIGNMENTS}/'
        Import = "import { API_ENDPOINTS } from '../../config/api'"
    },
    @{
        File = "src\Components\AddAssignment\AddAssignment.jsx"
        Find = '`http://localhost:5006/api/courses/', '"http://localhost:5006/api/assignments"'
        Replace = '`${API_ENDPOINTS.COURSES}/', 'API_ENDPOINTS.ASSIGNMENTS'
        Import = "import { API_ENDPOINTS } from '../../config/api'"
    },
    @{
        File = "src\Components\TakeAssignment\TakeAssignment.jsx"
        Find = '`http://localhost:5006/api/assignments/'
        Replace = '`${API_ENDPOINTS.ASSIGNMENTS}/'
        Import = "import { API_ENDPOINTS } from '../../config/api'"
    }
)

$updatedCount = 0
$skippedCount = 0

foreach ($item in $replacements) {
    $filePath = Join-Path $PSScriptRoot "..\$($item.File)"
    
    if (-not (Test-Path $filePath)) {
        Write-Host "⚠️  File not found: $($item.File)" -ForegroundColor Yellow
        $skippedCount++
        continue
    }

    $content = Get-Content $filePath -Raw
    $originalContent = $content
    $modified = $false

    # Check if import already exists
    $hasImport = $content -match 'from\s+[''"]\.\.\/config\/api[''"]' -or 
                 $content -match 'from\s+[''"]\.\.\/\.\.\/config\/api[''"]'

    # Add import if needed
    if (-not $hasImport) {
        # Find the last import statement
        $lastImport = [regex]::Matches($content, '^import\s+.*$', 'Multiline') | Select-Object -Last 1
        
        if ($lastImport) {
            $insertPosition = $lastImport.Index + $lastImport.Length
            $content = $content.Insert($insertPosition, "`r`n$($item.Import)")
            $modified = $true
        }
    }

    # Replace all occurrences
    if ($item.Find -is [array]) {
        for ($i = 0; $i -lt $item.Find.Length; $i++) {
            if ($content -match [regex]::Escape($item.Find[$i])) {
                $content = $content -replace [regex]::Escape($item.Find[$i]), $item.Replace[$i]
                $modified = $true
            }
        }
    } else {
        if ($content -match [regex]::Escape($item.Find)) {
            $content = $content -replace [regex]::Escape($item.Find), $item.Replace
            $modified = $true
        }
    }

    if ($modified) {
        Set-Content -Path $filePath -Value $content -NoNewline
        Write-Host "✅ Updated: $($item.File)" -ForegroundColor Green
        $updatedCount++
    } else {
        Write-Host "⏭️  Skipped (no changes): $($item.File)" -ForegroundColor Gray
        $skippedCount++
    }
}

Write-Host ""
Write-Host "✨ API URL replacement complete!" -ForegroundColor Green
Write-Host "   Updated: $updatedCount files" -ForegroundColor Cyan
Write-Host "   Skipped: $skippedCount files" -ForegroundColor Gray
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Update .env file with: REACT_APP_API_URL=https://your-render-app.onrender.com" -ForegroundColor White
Write-Host "2. Restart your development server: npm start" -ForegroundColor White
Write-Host "3. Test your application to ensure all API calls work correctly" -ForegroundColor White
