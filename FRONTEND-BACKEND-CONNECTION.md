# 🔧 Quick Reference: Connect Frontend to Backend

## ✅ What Was Done

1. ✅ Created `src/config/api.js` - Centralized API configuration
2. ✅ Updated `.env` file with `REACT_APP_API_URL`
3. ✅ Updated Login & Signup components
4. ✅ Ran automated script to update 13+ remaining files

## 🚀 To Deploy (3 Simple Steps)

### Step 1: Update .env
Edit `.env` in project root:
```
REACT_APP_API_URL=https://your-actual-render-url.onrender.com
```

### Step 2: Restart Server
```bash
npm start
```

### Step 3: Test
- Login/Signup should work
- Check Network tab - all requests should go to Render URL

## 🔍 How It Works

The `src/config/api.js` file reads from environment variables:

```javascript
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5006';
```

- **Local Dev:** Uses `localhost:5006` if env var not set
- **Production:** Uses Render URL from `.env`

## 📁 Files Modified

- `src/config/api.js` (NEW)
- `.env` (+1 line)
- `src/Components/Login/Login.jsx`
- `src/Components/SignUp/Signup.jsx`
- Plus 13 other component files

## 🐛 Troubleshooting

**APIs still hitting localhost?**
- Restart dev server (`Ctrl+C` then `npm start`)
- Clear browser cache (Ctrl+Shift+Del)

**CORS errors?**
- Backend needs to allow your frontend origin
- Check Render backend logs

**ENV variable undefined?**
- Must use `REACT_APP_` prefix (Create React App requirement)
- Restart server after changing `.env`

## 🎯 Next: Deploy Frontend

**Netlify/Vercel:**
1. Push to GitHub
2. Connect repo
3. Add env var: `REACT_APP_API_URL=https://your-backend.onrender.com`
4. Deploy!

See `deployment-guide.md` for full instructions.
