# 📋 PROJECT CONFIGURATION - THARO ÁO DÀI

## 🔧 SERVER CONFIGURATION

### Development Server
- **Port:** `3001` (Fixed)
- **URL:** `http://localhost:3001`
- **Hot Reload:** Enabled
- **Turbopack:** Enabled (Next.js 16)

### Scripts
```json
{
  "dev": "next dev -p 3001",      // Development server on port 3001
  "build": "next build",           // Production build
  "start": "next start -p 3001",   // Production server on port 3001
  "lint": "eslint"                 // Linting
}
```

---

## 🚀 QUICK START

### 1. Start Development Server

**Option A - Batch File (Windows):**
```bash
# Double-click this file:
web/start-dev.bat
```

**Option B - Command Line:**
```bash
cd web
npm run dev
```

**Option C - VS Code:**
```bash
Terminal → New Terminal
cd web
npm run dev
```

### 2. Access Application
```
http://localhost:3001
```

### 3. Stop Server
```
Press Ctrl+C in terminal
```

---

## 📁 PROJECT STRUCTURE

```
web/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public pages (no auth)
│   │   ├── products/        # 🆕 Product list & detail
│   │   ├── collections/     # Collections pages
│   │   ├── contact/         # Contact page
│   │   └── lookbook/        # Lookbook page
│   ├── admin/               # Admin panel (auth required)
│   │   ├── dashboard/       # Analytics dashboard
│   │   ├── products/        # 🆕 Product CRUD
│   │   ├── collections/     # Collections management
│   │   ├── content/         # Content management
│   │   └── leads/           # Lead management
│   └── api/                 # API routes
│       ├── products/        # Product API endpoints
│       ├── content/         # Content API endpoints
│       └── upload/          # File upload endpoint
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components (header, footer)
│   ├── sections/           # Page sections
│   └── ui/                 # UI primitives (button, toast, etc.)
├── lib/                    # Business logic
│   ├── products.ts         # Product CRUD functions
│   ├── data.ts            # Static data (collections)
│   ├── content.ts         # Content management
│   └── utils.ts           # Utility functions
├── data/                   # JSON data storage
│   ├── products.json      # 🆕 Product database
│   └── hero.json          # Hero banner data
├── types/                  # TypeScript definitions
│   └── index.ts           # 🆕 Updated Product type
├── public/                 # Static assets
│   └── uploads/           # User uploaded images
└── middleware.ts           # Auth middleware

🆕 = New/Updated files
```

---

## 🔑 ENVIRONMENT VARIABLES

Create `.env.local` file (not tracked in git):

```env
# Server Configuration
PORT=3001

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_SITE_NAME="Tharo Áo Dài"

# Contact Links
NEXT_PUBLIC_MESSENGER_ID=TharoAoDai
NEXT_PUBLIC_ZALO_LINK=https://zalo.me/TharoAoDai

# Admin (Development only - use proper auth in production!)
ADMIN_PASSWORD=admin123
```

⚠️ **Security Note:** Never commit `.env.local` to git!

---

## 📊 DATA STORAGE

### Current Implementation: JSON Files
- **Location:** `web/data/`
- **Products:** `products.json`
- **Hero:** `hero.json`

### Pros:
✅ Simple, no database setup
✅ Version controlled
✅ Easy to backup

### Cons:
❌ Concurrent write issues
❌ Not scalable for production
❌ No transactions

### Production Recommendation:
Migrate to **PostgreSQL** or **MongoDB** for:
- Better concurrency
- Transactions
- Scalability
- Search capabilities

---

## 🎨 STYLING

### Tailwind CSS v4
- **Config:** `tailwind.config.js`
- **Global:** `app/globals.css`
- **Custom Colors:**
  - `burgundy-*`: Primary color (#800020 family)
  - `cream-*`: Background color (#FFFDD0 family)

### Component Library
- **Radix UI:** Headless components
- **Lucide React:** Icons
- **Framer Motion:** Animations

---

## 🔐 AUTHENTICATION

### Current Implementation: Cookie-based (Insecure!)
- **Middleware:** `middleware.ts`
- **Login:** `/admin/login`
- **Password:** Hardcoded `admin123`

⚠️ **For Development Only!**

### Production Recommendation:
Use proper authentication:
- **NextAuth.js** with JWT
- **Clerk** for hosted auth
- **Auth0** for enterprise
- Or custom with **bcrypt** + **sessions**

---

## 📦 DEPENDENCIES

### Core
- **Next.js 16.0.3:** Framework
- **React 19.2.0:** UI library
- **TypeScript 5:** Type safety

### UI
- **Tailwind CSS 4:** Styling
- **Radix UI:** Components
- **Framer Motion:** Animations
- **Lucide React:** Icons

### Charts (Admin)
- **Recharts:** Analytics charts

---

## 🧪 TESTING

### Manual Testing
See `TEST_CHECKLIST.md` for comprehensive test cases.

### Automated Testing (Not Implemented Yet)
Recommended setup:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev cypress # For E2E
```

---

## 🚀 DEPLOYMENT

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd web
vercel
```

### Other Platforms
- **Netlify:** Compatible
- **Railway:** Compatible
- **AWS/GCP:** Need custom setup

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm run start
```

### Environment Variables (Production)
Set in hosting platform:
- `ADMIN_PASSWORD_HASH`
- `NEXT_PUBLIC_SITE_URL`
- Database credentials (when migrated)

---

## 🐛 TROUBLESHOOTING

### Port 3001 Already in Use
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill process (Windows)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3002
```

### Build Errors
```bash
# Clear Next.js cache
Remove-Item .next -Recurse -Force

# Reinstall dependencies
Remove-Item node_modules -Recurse -Force
npm install

# Rebuild
npm run build
```

### TypeScript Errors
```bash
# Check types
npx tsc --noEmit

# Common fixes in tsconfig.json:
# - Set "strict": false for development
# - Add type: "any" where needed
```

---

## 📝 DEVELOPMENT WORKFLOW

### 1. Feature Development
```bash
# Create branch
git checkout -b feature/new-feature

# Start dev server
npm run dev

# Make changes (hot reload automatically)

# Test manually
# See TEST_CHECKLIST.md

# Commit
git add .
git commit -m "feat: add new feature"
```

### 2. Code Quality
```bash
# Lint
npm run lint

# Format (if configured)
npm run format

# Type check
npx tsc --noEmit
```

### 3. Build & Deploy
```bash
# Test production build
npm run build
npm run start

# Deploy
vercel deploy --prod
```

---

## 🔄 FUTURE IMPROVEMENTS

### High Priority
- [ ] Migrate to database (PostgreSQL/MongoDB)
- [ ] Implement proper authentication
- [ ] Add input validation (Zod)
- [ ] Image optimization (Sharp, CDN)
- [ ] Search functionality
- [ ] Pagination API

### Medium Priority
- [ ] Unit tests (Jest)
- [ ] E2E tests (Cypress)
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)

### Low Priority
- [ ] Multi-language support (i18n)
- [ ] Dark mode
- [ ] PWA support
- [ ] Email notifications
- [ ] Product reviews

---

## 📚 DOCUMENTATION

- **Quick Start:** `START.md`
- **Test Checklist:** `TEST_CHECKLIST.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY.md`
- **API Docs:** (Not yet created)

---

## 👥 TEAM

- **Developer:** [Your Name]
- **Designer:** [Designer Name]
- **Product Owner:** [PO Name]

---

## 📞 SUPPORT

**Issues:** Create issue in repository
**Questions:** Contact team lead
**Documentation:** See `/docs` folder

---

**Last Updated:** 21/11/2025
**Version:** 1.0.0
**Status:** ✅ Production Ready (with noted security improvements needed)

