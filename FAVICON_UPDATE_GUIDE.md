# 🎨 Hướng Dẫn Đổi Favicon Tharo

## 📋 Yêu cầu
Đổi favicon thành logo Tharo burgundy với chữ script trắng.

---

## ✅ Cách 1: Dùng PNG/SVG (Khuyến nghị)

Next.js 16 tự động pick up các file sau trong `app/` directory:
- `icon.png`
- `icon.svg`
- `apple-icon.png`
- `favicon.ico`

### **Bước 1: Tạo file icon từ ảnh**

**Option A: Dùng tool online (Nhanh nhất)**
1. Vào: https://favicon.io/favicon-converter/
2. Upload ảnh logo Tharo (ảnh burgundy với chữ trắng)
3. Download file `favicon.ico` hoặc `favicon.png`

**Option B: Dùng Photoshop/Figma**
1. Resize ảnh về các kích thước:
   - 16x16 (favicon nhỏ)
   - 32x32 (favicon standard)
   - 192x192 (Android)
   - 512x512 (iOS)
2. Export dạng `.ico` hoặc `.png`

---

### **Bước 2: Thay thế file**

**Nếu dùng .ico:**
```bash
# Delete file cũ
web/app/favicon.ico (existing)

# Add file mới
web/app/favicon.ico (new burgundy logo)
```

**Nếu dùng .png (Recommended):**
```bash
# Thêm file mới
web/app/icon.png           # 32x32 hoặc 192x192
web/app/apple-icon.png     # 180x180 (optional, cho iOS)

# Có thể xóa favicon.ico cũ (optional)
```

---

### **Bước 3: Update Metadata (Optional)**

File: `web/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: {
    default: "Tharo - Áo Dài Truyền Thống Việt Nam",
    template: "%s | Tharo",
  },
  description: "Thương hiệu Áo Dài thiết kế cao cấp...",
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
};
```

---

## 🎨 Cách 2: Tạo Dynamic Icon (Advanced)

Tạo file `icon.tsx` để generate icon động:

**File: `web/app/icon.tsx`**
```tsx
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#7d1f3c', // Burgundy
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'serif',
          fontStyle: 'italic',
        }}
      >
        T
      </div>
    ),
    {
      ...size,
    }
  )
}
```

---

## 🔧 Cách 3: Convert ảnh thành .ico

### **Online Tools:**
1. **favicon.io** - https://favicon.io/favicon-converter/
2. **ICO Converter** - https://www.icoconverter.com/
3. **Cloudconvert** - https://cloudconvert.com/png-to-ico

### **Steps:**
1. Upload ảnh logo Tharo (burgundy background)
2. Chọn sizes: 16x16, 32x32, 48x48
3. Download `favicon.ico`
4. Replace file tại `web/app/favicon.ico`

---

## 📱 Favicon Sizes Reference

### **Standard Favicon:**
- `favicon.ico`: 16x16, 32x32 (multiple sizes in one file)
- `icon.png`: 32x32 or 192x192

### **Apple Touch Icon:**
- `apple-icon.png`: 180x180

### **Android Chrome:**
- `icon-192.png`: 192x192
- `icon-512.png`: 512x512

### **Microsoft Tiles:**
- `tile-150.png`: 150x150
- `tile-310.png`: 310x310

---

## 🎨 Recommended: Multi-size Setup

**Create these files:**
```
web/app/
├── favicon.ico          # 32x32 (fallback)
├── icon.png             # 192x192 (main)
├── apple-icon.png       # 180x180 (iOS)
└── icon-512.png         # 512x512 (Android)
```

**Then update `layout.tsx`:**
```typescript
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};
```

---

## 🧪 Testing

### **After updating favicon:**

1. **Clear browser cache:**
   - Chrome: `Ctrl + Shift + Delete`
   - Or hard refresh: `Ctrl + F5`

2. **Check in browser:**
   - Desktop tab
   - Mobile home screen (if added)
   - Bookmarks

3. **Verify files:**
   ```bash
   # Check if file exists
   ls web/app/icon.png
   ls web/app/favicon.ico
   ```

4. **Dev server restart:**
   ```bash
   cd web
   npm run dev
   ```

---

## 🎯 Quick Start (Fastest Method)

### **For immediate update:**

1. **Go to:** https://favicon.io/favicon-converter/
2. **Upload:** Ảnh logo Tharo (burgundy + white text)
3. **Download:** Generated files
4. **Copy to:** `web/app/favicon.ico`
5. **Restart dev server**
6. **Hard refresh browser:** `Ctrl + F5`

Done! ✅

---

## 📊 Logo Specifications

### **Current Tharo Logo:**
- Background: Burgundy (#7d1f3c or similar)
- Text: White script font "Tharo"
- Style: Elegant, traditional Vietnamese
- Format needed: Square crop for favicon

### **Recommended Sizes:**
- **Minimum:** 32x32 (favicon.ico)
- **Standard:** 192x192 (icon.png)
- **High-res:** 512x512 (for PWA)

---

## 🚀 Result

After updating, favicon will show:
- ✅ Burgundy background
- ✅ White "Tharo" script text
- ✅ Consistent branding across all devices
- ✅ Professional appearance in browser tabs
- ✅ Beautiful on mobile home screen

---

## 💡 Pro Tips

1. **Keep it simple:** Favicon is very small (16x16), so simple logo works best
2. **High contrast:** White on burgundy is perfect
3. **Test on light/dark mode:** Ensure visibility
4. **Cache:** Browsers cache favicon heavily, always hard refresh
5. **Multiple formats:** Provide both .ico and .png for compatibility

---

## ❓ Troubleshooting

### **Favicon not updating?**
```bash
# 1. Clear cache
Ctrl + Shift + Delete

# 2. Hard refresh
Ctrl + F5

# 3. Restart dev server
npm run dev

# 4. Check file path
web/app/favicon.ico
web/app/icon.png

# 5. Check metadata
web/app/layout.tsx
```

### **Still showing old icon?**
- Try incognito mode
- Check other browsers
- Verify file was actually replaced
- Ensure no CDN caching

---

## 📁 Files to Create/Update

```
✅ web/app/favicon.ico        (Replace with burgundy logo)
✅ web/app/icon.png            (Optional, but recommended)
✅ web/app/apple-icon.png      (Optional, for iOS)
✅ web/app/layout.tsx          (Update metadata if using PNG)
```

---

## 🎉 Summary

**Easiest method:**
1. Upload logo to https://favicon.io/favicon-converter/
2. Download `favicon.ico`
3. Replace `web/app/favicon.ico`
4. Hard refresh browser

**Result:** Professional Tharo branding in every browser tab! 🏮✨

