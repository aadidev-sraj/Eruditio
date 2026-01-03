const fs = require('fs');
const path = require('path');

console.log('🔄 Updating remaining files with API configuration...\n');

// Map of files to update with their specific replacements
const filesToUpdate = [
    { file: 'src/Pages/ForgotPassword/ForgotPassword.jsx', depth: 2 },
    { file: 'src/Pages/Profile/Profile.jsx', depth: 2 },
    { file: 'src/Pages/Dashboard/Dashboard.jsx', depth: 2 },
    { file: 'src/Pages/MyLearnings/MyLearnings.jsx', depth: 2 },
    { file: 'src/Pages/MyCourses/MyCourses.jsx', depth: 2 },
    { file: 'src/Pages/Assignment/Assignments.jsx', depth: 2 },
    { file: 'src/Pages/Assignment/CourseAssignments.jsx', depth: 2 },
    { file: 'src/Pages/AddCourses/AddCourse.jsx', depth: 2 },
    { file: 'src/Components/Homepage/Homepage.jsx', depth: 2 },
    { file: 'src/Components/CourseView/CourseView.jsx', depth: 2 },
    { file: 'src/Components/Assignment/Assignment.jsx', depth: 2 },
    { file: 'src/Components/AddAssignment/AddAssignment.jsx', depth: 2 },
    { file: 'src/Components/TakeAssignment/TakeAssignment.jsx', depth: 2 },
];

let updatedCount = 0;
let skippedCount = 0;

filesToUpdate.forEach(({ file, depth }) => {
    const filePath = path.join(process.cwd(), file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        skippedCount++;
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let modified = false;

    // Check if already has the import
    const hasImport = content.includes('from "../../config/api"') ||
        content.includes("from '../../config/api'") ||
        content.includes('from "../config/api"') ||
        content.includes("from '../config/api'");

    // Add import if needed
    if (!hasImport && content.includes('localhost:5006')) {
        const relativePath = '../'.repeat(depth) + 'config/api';
        const importStatement = `import { API_ENDPOINTS, API_BASE_URL, getApiUrl } from "${relativePath}"\n`;

        // Find last import line
        const lines = content.split('\n');
        let lastImportIndex = -1;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('import ')) {
                lastImportIndex = i;
            }
        }

        if (lastImportIndex >= 0) {
            lines.splice(lastImportIndex + 1, 0, importStatement);
            content = lines.join('\n');
            modified = true;
        }
    }

    // Replace localhost URLs
    const replacements = [
        // Quoted strings
        { from: '"http://localhost:5006/api/profile"', to: 'API_ENDPOINTS.PROFILE' },
        { from: '"http://localhost:5006/api/enrollments"', to: 'API_ENDPOINTS.ENROLLMENTS' },
        { from: '"http://localhost:5006/api/courses"', to: 'API_ENDPOINTS.COURSES' },
        { from: '"http://localhost:5006/api/assignments"', to: 'API_ENDPOINTS.ASSIGNMENTS' },
        { from: "'http://localhost:5006/api/auth/forgot-password'", to: 'API_ENDPOINTS.AUTH_FORGOT_PASSWORD' },
        { from: '"http://localhost:5006/api/courses/instructor"', to: 'API_ENDPOINTS.COURSES_INSTRUCTOR' },
        { from: '"http://localhost:5006/api/courses/search', to: 'API_ENDPOINTS.COURSES_SEARCH' },

        // Template literals - keep the template literal format
        { from: '`http://localhost:5006/api/enrollments/', to: '`${API_ENDPOINTS.ENROLLMENTS}/' },
        { from: '`http://localhost:5006/api/courses/', to: '`${API_ENDPOINTS.COURSES}/' },
        { from: '`http://localhost:5006/api/assignments/', to: '`${API_ENDPOINTS.ASSIGNMENTS}/' },
        { from: '`http://localhost:5006/api/upload/', to: '`${AP I_ENDPOINTS.UPLOAD}/' },
        { from: '`http://localhost:5006/api/youtube/', to: '`${API_BASE_URL}/api/youtube/' },
        { from: '`http://localhost:5006${', to: '`${API_BASE_URL}${' },
        { from: '`http://localhost:5006/', to: '`${API_BASE_URL}/' },
    ];

    replacements.forEach(({ from, to }) => {
        if (content.includes(from)) {
            content = content.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
            modified = true;
        }
    });

    if (modified && content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${file}`);
        updatedCount++;
    } else {
        console.log(`⏭️  Skipped (no changes needed): ${file}`);
        skippedCount++;
    }
});

console.log('\n✨ Update complete!');
console.log(`   ✅ Updated: ${updatedCount} files`);
console.log(`   ⏭️  Skipped: ${skippedCount} files`);
console.log('\n📝 Next steps:');
console.log('1. Update .env with your Render URL: REACT_APP_API_URL=https://your-render-url.onrender.com');
console.log('2. Restart dev server: npm start');
console.log('3. Test the application\n');
