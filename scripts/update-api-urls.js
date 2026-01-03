/**
 * Script to replace hardcoded localhost URLs with API configuration
 * Run this with: node scripts/update-api-urls.js
 */

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    {
        file: 'src/Components/SignUp/Signup.jsx',
        replacements: [
            {
                search: '"http://localhost:5006/api/auth/signup"',
                replace: 'API_ENDPOINTS.AUTH_SIGNUP',
                needsImport: true
            }
        ]
    },
    {
        file: 'src/Pages/ForgotPassword/ForgotPassword.jsx',
        replacements: [
            {
                search: "'http://localhost:5006/api/auth/forgot-password'",
                replace: 'API_ENDPOINTS.AUTH_FORGOT_PASSWORD',
                needsImport: true
            }
        ]
    },
    {
        file: 'src/Pages/Profile/Profile.jsx',
        replacements: [
            {
                search: '"http://localhost:5006/api/profile"',
                replace: 'API_ENDPOINTS.PROFILE',
                needsImport: true
            }
        ]
    },
    {
        file: 'src/Pages/Dashboard/Dashboard.jsx',
        replacements: [
            {
                search: '"http://localhost:5006/api/profile"',
                replace: 'API_ENDPOINTS.PROFILE',
                needsImport: true,
                useGetApiUrl: true
            }
        ]
    },
    {
        file: 'src/Pages/MyLearnings/MyLearnings.jsx',
        replacements: [
            {
                search: '"http://localhost:5006/api/enrollments"',
                replace: 'API_ENDPOINTS.ENROLLMENTS',
                needsImport: true,
                useGetApiUrl: true
            }
        ]
    },
    {
        file: 'src/Pages/MyCourses/MyCourses.jsx',
        replacements: [
            {
                search: '"http://localhost:5006/api/courses/instructor"',
                replace: 'API_ENDPOINTS.COURSES_INSTRUCTOR',
                needsImport: true,
                useGetApiUrl: true,
                useBaseUrl: true
            }
        ]
    },
    {
        file: 'src/Components/Homepage/Homepage.jsx',
        replacements: [
            {
                search: '`http://localhost:5006/api/youtube/search?q=${query}`',
                replace: '`${API_ENDPOINTS.YOUTUBE_SEARCH}?q=${query}`',
                needsImport: true
            }
        ]
    },
    {
        file: 'src/Components/CourseView/CourseView.jsx',
        replacements: [
            {
                search: '`http://localhost:5006/',
                replace: '`${API_BASE_URL}/',
                needsImport: true,
                useGetApiUrl: true
            }
        ]
    },
    {
        file: 'src/Components/Assignment/Assignment.jsx',
        replacements: [
            {
                search: '`http://localhost:5006/api/assignments/',
                replace: '`${API_ENDPOINTS.ASSIGNMENTS}/',
                needsImport: true
            }
        ]
    },
    {
        file: 'src/Components/AddAssignment/AddAssignment.jsx',
        replacements: [
            {
                search: '"http://localhost:5006/api/assignments"',
                replace: 'API_ENDPOINTS.ASSIGNMENTS',
                needsImport: true,
                useGetApiUrl: true
            }
        ]
    },
    {
        file: 'src/Pages/AddCourses/AddCourse.jsx',
        replacements: [
            {
                search: '`http://localhost:5006/api/upload/',
                replace: '`${API_ENDPOINTS.UPLOAD}/',
                needsImport: true
            }
        ]
    },
    {
        file: 'src/Components/TakeAssignment/TakeAssignment.jsx',
        replacements: [
            {
                search: '`http://localhost:5006/api/assignments/',
                replace: '`${API_ENDPOINTS.ASSIGNMENTS}/',
                needsImport: true
            }
        ]
    },
    {
        file: 'src/Pages/Assignment/Assignments.jsx',
        replacements: [
            {
                search: '"http://localhost:5006/api/enrollments"',
                replace: 'API_ENDPOINTS.ENROLLMENTS',
                needsImport: true
            }
        ]
    },
    {
        file: 'src/Pages/Assignment/CourseAssignments.jsx',
        replacements: [
            {
                search: '`http://localhost:5006/api/',
                replace: '`${API_BASE_URL}/api/',
                needsImport: true,
                useGetApiUrl: true
            }
        ]
    }
];

console.log('Starting API URL replacement...\n');

filesToUpdate.forEach(({ file, replacements }) => {
    const filePath = path.join(process.cwd(), file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if import already exists
    const hasImport = content.includes('from "../../config/api"') ||
        content.includes('from "../config/api"') ||
        content.includes('from \'../../config/api\'') ||
        content.includes('from \'../config/api\'');

    // Add import if needed
    if (replacements.some(r => r.needsImport) && !hasImport) {
        const importDepth = (file.match(/\//g) || []).length - 1;
        const relativePath = '../'.repeat(importDepth) + 'config/api';

        // Determine what to import
        const useGetApiUrl = replacements.some(r => r.useGetApiUrl);
        const useBaseUrl = replacements.some(r => r.useBaseUrl);

        let importStatement = 'import { API_ENDPOINTS';
        if (useGetApiUrl) importStatement += ', getApiUrl';
        if (useBaseUrl) importStatement += ', API_BASE_URL';
        importStatement += ` } from "${relativePath}"\n`;

        // Insert import after existing imports
        const lastImportMatch = content.match(/^import .+$/gm);
        if (lastImportMatch) {
            const lastImport = lastImportMatch[lastImportMatch.length - 1];
            content = content.replace(lastImport, lastImport + '\n' + importStatement);
        } else {
            // If no imports found, add at the beginning
            content = importStatement + '\n' + content;
        }
        modified = true;
    }

    // Apply replacements
    replacements.forEach(({ search, replace }) => {
        const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        if (content.match(regex)) {
            content = content.replace(regex, replace);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${file}`);
    } else {
        console.log(`⏭️  Skipped (no changes): ${file}`);
    }
});

console.log('\n✨ API URL replacement complete!');
console.log('\n📝 Next steps:');
console.log('1. Update .env file with: REACT_APP_API_URL=https://your-render-app.onrender.com');
console.log('2. Restart your development server: npm start');
console.log('3. Test your application to ensure all API calls work correctly');
