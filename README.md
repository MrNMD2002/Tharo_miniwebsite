# 🏮 THARO ÁO DÀI - E-Commerce Website

Modern e-commerce platform for traditional Vietnamese Áo Dài, built with Next.js 16 and React 19.

## ⚡ Quick Start

### 1. Start Development Server

**Windows (Double-click):**
```
web/start-dev.bat
```

**Terminal:**
```bash
cd web
npm run dev
```

### 2. Open Browser
```
http://localhost:3001
```

### 3. Admin Access
```
http://localhost:3001/admin/login
Password: admin123
```

---

## 📚 Documentation

- **[Quick Start Guide](web/QUICK_START.md)** - Get started in 3 steps
- **[Project Configuration](web/PROJECT_CONFIG.md)** - Full configuration details
- **[Test Checklist](TEST_CHECKLIST.md)** - Comprehensive testing guide
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Feature details

---

## ✨ Features

### Public Site
- 🎨 **Product List** - Grid view with filters & sorting
- 🔍 **Product Detail** - Gallery, colors, sizes, pricing
- 📦 **Collections** - Browse by collection
- 📞 **Contact** - Messenger/Zalo integration

### Admin Panel
- ➕ **Product Management** - Create, edit, delete products
- 🖼️ **Media Upload** - Drag & drop image upload
- 📊 **Analytics Dashboard** - Views, clicks, traffic
- 👥 **Lead Management** - Customer inquiries

### New in This Version
- ✅ **3:4 Aspect Ratio** images with hover zoom
- ✅ **Filter & Sort** - By color, collection, newest
- ✅ **Pagination** - Configurable items per page
- ✅ **Colors & Sizes** - Dynamic arrays in admin
- ✅ **Video Support** - Up to 1 video per product
- ✅ **Price Display** - Original price strikethrough

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.0.3 (App Router)
- **UI:** React 19.2.0
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Components:** Radix UI
- **Icons:** Lucide React
- **Animation:** Framer Motion
- **Charts:** Recharts

---

## 📁 Project Structure

```
Tharo_GoogleAnti/
├── web/                    # Next.js application
│   ├── app/               # App Router pages
│   │   ├── (public)/      # Public pages
│   │   ├── admin/         # Admin panel
│   │   └── api/           # API routes
│   ├── components/        # React components
│   ├── lib/              # Business logic
│   ├── data/             # JSON database
│   ├── types/            # TypeScript types
│   └── public/           # Static assets
├── TEST_CHECKLIST.md      # Testing guide
├── IMPLEMENTATION_SUMMARY.md  # Feature docs
└── README.md             # This file
```

---

## 🚀 Deployment

### Development
```bash
npm run dev    # Port 3001
```

### Production Build
```bash
npm run build
npm run start  # Port 3001
```

### Deploy to Vercel
```bash
vercel deploy
```

---

## 🔐 Security Notes

⚠️ **Current Implementation:**
- Cookie-based auth (insecure)
- Hardcoded password
- JSON file storage
- No input validation

✅ **Production Requirements:**
- Use NextAuth.js or similar
- Environment variables for secrets
- Database (PostgreSQL/MongoDB)
- Input validation (Zod)
- Rate limiting
- HTTPS only

---

## 📊 Data Structure

### Products (JSON)
```typescript
{
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  material?: string;
  primaryColor?: string;
  colors?: string[];
  sizes?: string[];
  images: string[];  // Max 5
  videoUrl?: string; // Max 1
  status: string;
  collectionId?: string;
  sortOrder?: number;
  createdAt?: string;
}
```

---

## 🧪 Testing

### Manual Testing
See [TEST_CHECKLIST.md](TEST_CHECKLIST.md) for:
- 50+ test cases
- Desktop & mobile scenarios
- Edge case handling
- Bug report template

### Automated Testing (TODO)
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Cypress)

---

## 📝 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Install Dependencies
```bash
cd web
npm install
```

### Environment Variables
Create `web/.env.local`:
```env
PORT=3001
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_MESSENGER_ID=TharoAoDai
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

---

## 🐛 Troubleshooting

### Port 3001 in use?
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Clear cache
```bash
cd web
Remove-Item .next -Recurse -Force
npm run dev
```

### Reinstall dependencies
```bash
Remove-Item node_modules -Recurse -Force
npm install
```

---

## 📞 Support

- **Documentation:** See `/web/PROJECT_CONFIG.md`
- **Issues:** Create GitHub issue
- **Questions:** Contact development team

---

## 📜 License

Private project - All rights reserved

---

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] Product list with filters
- [x] Product detail pages
- [x] Admin CRUD operations
- [x] Image upload
- [x] Basic analytics

### Phase 2 (Next)
- [ ] Database migration
- [ ] Proper authentication
- [ ] Search functionality
- [ ] Email notifications
- [ ] Payment integration

### Phase 3 (Future)
- [ ] Mobile app
- [ ] Multi-language
- [ ] Advanced analytics
- [ ] Marketing automation
- [ ] Inventory management

---

**Version:** 1.0.0  
**Last Updated:** 21/11/2025  
**Status:** ✅ Development Ready  
**Port:** 3001 (Fixed)

---

Made with ❤️ for Tharo Áo Dài

