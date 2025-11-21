# ⚡ QUICK START - THARO ÁO DÀI

## 🚀 START IN 3 STEPS

### 1️⃣ Start Server
```bash
# Double-click this file:
start-dev.bat

# Or run in terminal:
cd web
npm run dev
```

### 2️⃣ Open Browser
```
http://localhost:3001
```

### 3️⃣ Test Features
- Click **"XEM TẤT CẢ"** → Product list
- Try **filters & sorting**
- Click a product → See detail page
- Go to `/admin/login` (password: `admin123`)

---

## 📍 KEY URLS

| Page | URL |
|------|-----|
| **Home** | http://localhost:3001 |
| **Products** 🆕 | http://localhost:3001/products |
| **Product Detail** 🆕 | http://localhost:3001/products/ao-dai-an |
| **Collections** | http://localhost:3001/collections |
| **Admin Login** | http://localhost:3001/admin/login |
| **Admin Products** 🆕 | http://localhost:3001/admin/products |
| **New Product** 🆕 | http://localhost:3001/admin/products/new |

---

## ✨ NEW FEATURES

### **Product List** (`/products`)
✅ 3:4 aspect ratio images
✅ Hover zoom 4-6%
✅ Filter by color & collection
✅ Sort: Newest, By Collection, Manual
✅ Pagination: 8/12/24/48 per page
✅ "Liên hệ" button → Copy info + Open Messenger

### **Product Detail** (`/products/[slug]`)
✅ 3-column layout (Desktop)
✅ Thumbnails left, main image center, info right
✅ Hover zoom 10-15%
✅ Max 6 media (5 images + 1 video)
✅ Colors pills & Sizes boxes
✅ Original price strikethrough
✅ Copy info & Contact buttons

### **Admin Forms** (`/admin/products/new|edit`)
✅ Original price field
✅ Primary color field
✅ Colors array (Enter to add)
✅ Sizes array (Enter to add)
✅ Video URL field
✅ Zalo link field
✅ Sort order field

---

## 🐛 TROUBLESHOOTING

### Port 3001 in use?
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
npm run dev
```

### Build errors?
```bash
Remove-Item .next -Recurse -Force
npm run dev
```

### Server not starting?
```bash
cd web
npm install
npm run dev
```

---

## 📚 MORE INFO

- **Full Tests:** `TEST_CHECKLIST.md`
- **Configuration:** `PROJECT_CONFIG.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY.md`

---

**Port:** 3001 (Fixed)  
**Password:** admin123  
**Status:** ✅ Ready

