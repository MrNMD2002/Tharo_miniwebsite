# 🚀 Hướng Dẫn Deploy Tharo Lên Vercel

## ✅ Build Test Thành Công!

Build local đã pass! Project sẵn sàng deploy.

---

## 📋 Bước 1: Chuẩn Bị Git Repository

### 1.1 Khởi tạo Git (nếu chưa có)

```bash
cd D:\Cusor\Tharo_GoogleAnti
git init
git add .
git commit -m "Initial commit - Tharo ready for deployment"
```

### 1.2 Tạo Repository trên GitHub

1. Vào https://github.com/new
2. Tạo repository mới: **`tharo-aodai`**
3. **KHÔNG** chọn "Initialize with README"
4. Click **"Create repository"**

### 1.3 Push Code Lên GitHub

```bash
# Thay YOUR_USERNAME bằng GitHub username của bạn
git remote add origin https://github.com/YOUR_USERNAME/tharo-aodai.git
git branch -M main
git push -u origin main
```

---

## 📦 Bước 2: Deploy Lên Vercel

### 2.1 Tạo Tài Khoản Vercel

1. Vào https://vercel.com
2. Click **"Sign Up"**
3. Chọn **"Continue with GitHub"**
4. Authorize Vercel truy cập GitHub

### 2.2 Import Project

1. Trong Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Chọn repository **`tharo-aodai`**
3. Click **"Import"**

### 2.3 Configure Project

**Framework Preset:** Next.js (tự động detect)

**Root Directory:** `web`

**Build Command:** 
```
npm run build
```

**Output Directory:** 
```
.next
```

**Install Command:**
```
npm install
```

### 2.4 Environment Variables

**KHÔNG CẦN** environment variables cho lần deploy đầu tiên vì:
- JSON file-based database (không cần DB connection)
- No API keys needed
- Admin auth đơn giản (cookie-based)

### 2.5 Deploy!

1. Click **"Deploy"**
2. Chờ 2-3 phút
3. ✅ Xong!

---

## 🌐 Bước 3: Truy Cập Website

Sau khi deploy xong, bạn sẽ nhận được:

```
🎉 Your project is live!

Production: https://tharo-aodai.vercel.app
```

### Test các trang:

- **Homepage:** https://tharo-aodai.vercel.app
- **Sản phẩm:** https://tharo-aodai.vercel.app/products
- **Bộ sưu tập:** https://tharo-aodai.vercel.app/collections
- **Lookbook:** https://tharo-aodai.vercel.app/lookbook
- **Về Tharo:** https://tharo-aodai.vercel.app/about
- **Admin:** https://tharo-aodai.vercel.app/admin/login

---

## ⚙️ Bước 4: Custom Domain (Optional)

### 4.1 Thêm Domain Của Bạn

1. Trong Vercel project settings
2. Vào tab **"Domains"**
3. Nhập domain: `tharo.vn` (ví dụ)
4. Click **"Add"**

### 4.2 Cấu Hình DNS

Vercel sẽ cung cấp DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Copy và paste vào DNS provider của bạn (GoDaddy, Namecheap, CloudFlare, v.v.)

### 4.3 Chờ DNS Propagate

- Thường mất 5-30 phút
- Tối đa 24-48 giờ
- Check tại: https://dnschecker.org

---

## 🔄 Bước 5: Cập Nhật Code (Continuous Deployment)

Sau khi deploy xong, **MỌI LẦN** bạn push code mới lên GitHub:

```bash
git add .
git commit -m "Update feature XYZ"
git push
```

→ Vercel sẽ **TỰ ĐỘNG** deploy version mới trong 2-3 phút! 🚀

---

## ⚠️ Lưu Ý Quan Trọng

### 📸 Upload Ảnh

- Ảnh đang lưu trong `/public/uploads`
- **KHÔNG BỊ MẤT** khi deploy lần đầu
- Nhưng **SẼ MẤT** nếu:
  - User upload ảnh mới trên production
  - Sau đó bạn push code từ local
  - Vercel sẽ overwrite folder `/public/uploads`

### 💡 Giải Pháp Lâu Dài:

**Option 1: Dùng Cloudinary (Free 25GB)**
```bash
npm install cloudinary
```
- Upload ảnh lên cloud
- Không bị mất khi redeploy
- Tốc độ tải nhanh
- CDN toàn cầu

**Option 2: Dùng Vercel Blob Storage**
```bash
npm install @vercel/blob
```
- Native của Vercel
- Pay-as-you-go
- Dễ setup

**Option 3: Dùng Supabase Storage (Free 1GB)**
```bash
npm install @supabase/supabase-js
```
- Open source
- Free tier tốt
- Có image optimization

### 📊 Analytics Data

- Đang lưu trong `web/data/analytics-events.json`
- **SẼ BỊ RESET** mỗi lần redeploy
- **Giải pháp:** Migrate sang database thật (MongoDB, PostgreSQL, Supabase)

### 🔐 Admin Password

- Hiện tại: `admin123` (hardcoded)
- **Nên đổi** sau khi deploy production
- File: `web/app/admin/login/page.tsx`

---

## 🆘 Troubleshooting

### Build Failed

```bash
# Test build local trước
cd web
npm run build
```

### Dynamic Route 404

- Next.js App Router đang dùng dynamic routes
- Vercel tự động handle, không cần config thêm

### API Routes Not Working

- API routes sẽ chạy serverless
- Mỗi request tạo 1 lambda function
- **Limit:** 10s execution time (free tier)

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)

1. Vào project settings
2. Tab **"Analytics"**
3. Enable **"Web Analytics"**
4. Free tier: 10,000 page views/month

### Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 🎯 Performance Tips

### 1. Enable Edge Functions (Faster)

Trong `next.config.js`:

```js
export const runtime = 'edge'; // Cho API routes
```

### 2. Optimize Images

```tsx
import Image from 'next/image';

<Image 
  src="/uploads/product.jpg" 
  alt="Product"
  width={600}
  height={800}
  quality={85}
  placeholder="blur"
/>
```

### 3. Enable ISR (Incremental Static Regeneration)

```tsx
// app/products/page.tsx
export const revalidate = 60; // Revalidate mỗi 60s
```

---

## 🔒 Security Checklist

- [ ] Đổi admin password sau khi deploy
- [ ] Add rate limiting cho API routes
- [ ] Enable HTTPS (Vercel tự động)
- [ ] Add CORS headers nếu cần
- [ ] Validate user input trên server
- [ ] Sanitize file uploads

---

## 📈 Scaling Plan

### Current Setup (Good for 0-10k users/month)
- JSON file database
- Local file uploads
- Serverless functions

### Next Level (10k-100k users)
- Migrate to PostgreSQL/MongoDB
- Cloudinary for images
- Redis for caching
- Edge functions

### Enterprise (100k+ users)
- Database replication
- CDN optimization
- Dedicated servers
- Load balancing

---

## 🎉 Kết Quả

Sau khi deploy xong, bạn có:

✅ **Live Website:** https://tharo-aodai.vercel.app
✅ **Tự động deploy** mỗi khi push code
✅ **Free SSL/HTTPS** 
✅ **Global CDN** (tốc độ cao toàn cầu)
✅ **Serverless API** (scale tự động)
✅ **Admin Dashboard** hoàn chỉnh
✅ **Analytics** realtime

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Discord: https://vercel.com/discord

---

**🏮 Chúc bạn deploy thành công! Tharo sẵn sàng bay cao!** 🚀

