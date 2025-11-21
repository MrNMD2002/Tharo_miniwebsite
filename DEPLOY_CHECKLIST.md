# ✅ Deploy Checklist - Tharo

## 🚀 Trước Khi Deploy

### Code Quality
- [x] ✅ Build local thành công (`npm run build`)
- [x] ✅ Không có TypeScript errors
- [ ] ⏳ Test tất cả features trên local
- [ ] ⏳ Check responsive design (mobile/tablet/desktop)
- [ ] ⏳ Test trên nhiều browsers (Chrome, Firefox, Safari, Edge)

### Content & Data
- [x] ✅ Đã có sản phẩm mẫu trong `products.json`
- [x] ✅ Đã có collections mẫu trong `collections.json`
- [ ] ⏳ Upload ảnh sản phẩm thật (thay demo images)
- [ ] ⏳ Điền đầy đủ mô tả sản phẩm
- [ ] ⏳ Cập nhật thông tin "Về Tharo"
- [ ] ⏳ Cập nhật Hero Banner với ảnh thật
- [ ] ⏳ Upload Lookbook images

### Configuration
- [ ] ⏳ Đổi admin password (hiện tại: `admin123`)
- [x] ✅ Facebook Messenger link đã cập nhật
- [x] ✅ Analytics tracking đã setup
- [ ] ⏳ Google Analytics (nếu dùng)
- [ ] ⏳ Facebook Pixel (nếu dùng)

### Security
- [ ] ⏳ Đổi admin password mạnh hơn
- [ ] ⏳ Add rate limiting cho admin login
- [ ] ⏳ Validate file uploads (chỉ cho phép jpg, png, webp)
- [ ] ⏳ Add CAPTCHA cho contact form (future)

---

## 📦 Deploy Process

### Step 1: Git Setup
```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Production ready - Tharo v1.0"

# Push to GitHub
git push origin main
```

### Step 2: Vercel Setup
1. [ ] Tạo tài khoản Vercel
2. [ ] Connect GitHub repository
3. [ ] Import project
4. [ ] Set root directory: `web`
5. [ ] Deploy!

### Step 3: Verification
- [ ] Homepage load thành công
- [ ] Sản phẩm hiển thị đúng
- [ ] Collections hiển thị đúng
- [ ] Lookbook load được
- [ ] About page hiển thị
- [ ] Admin login hoạt động
- [ ] Upload ảnh hoạt động
- [ ] Analytics tracking hoạt động
- [ ] Messenger links hoạt động
- [ ] Mobile responsive OK

---

## 🔍 Sau Deploy - Testing

### Public Site
- [ ] Test trên mobile thật (iOS & Android)
- [ ] Test Messenger links mở app đúng
- [ ] Check tốc độ load trang (should be < 3s)
- [ ] Test tất cả navigation links
- [ ] Check SEO meta tags
- [ ] Test product filters/sorting
- [ ] Test pagination

### Admin Dashboard
- [ ] Login với password mới
- [ ] Thêm sản phẩm mới
- [ ] Edit sản phẩm
- [ ] Xóa sản phẩm
- [ ] Upload ảnh
- [ ] Reorder products
- [ ] Create collection
- [ ] Edit collection
- [ ] Lookbook management
- [ ] Analytics dashboard load đúng

### Performance
- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 90 (SEO)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] No console errors
- [ ] No 404 errors
- [ ] Images optimize (WebP format)

---

## ⚠️ Known Issues & Limitations

### 1. File Uploads
**Issue:** Ảnh upload sẽ bị mất khi redeploy
**Solution:** 
- [ ] Setup Cloudinary
- [ ] Setup Vercel Blob
- [ ] Setup Supabase Storage

### 2. Analytics Data
**Issue:** Analytics sẽ reset mỗi lần deploy
**Solution:**
- [ ] Migrate to MongoDB
- [ ] Migrate to PostgreSQL
- [ ] Use Supabase

### 3. Admin Auth
**Issue:** Password hardcoded, không có session management
**Solution:**
- [ ] Implement proper auth (NextAuth.js)
- [ ] Add JWT tokens
- [ ] Add "Remember me"
- [ ] Add password reset

### 4. No Search Function
**Issue:** Users không thể search sản phẩm
**Solution:**
- [ ] Add search bar
- [ ] Implement Algolia
- [ ] Add filters by price, color, size

### 5. No Email Notifications
**Issue:** Admin không nhận email khi có order
**Solution:**
- [ ] Setup SendGrid/Resend
- [ ] Add email templates
- [ ] Add order notifications

---

## 📈 Post-Launch Tasks

### Week 1
- [ ] Monitor analytics daily
- [ ] Check for errors in Vercel logs
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Update product images

### Week 2-4
- [ ] Add more products (target: 50+)
- [ ] Create 3-5 collections
- [ ] Upload lookbook photos (20-30 images)
- [ ] Setup proper image storage (Cloudinary)
- [ ] Add customer testimonials

### Month 2
- [ ] Migrate to real database
- [ ] Implement search function
- [ ] Add customer reviews
- [ ] Setup email marketing
- [ ] SEO optimization

### Month 3+
- [ ] Add shopping cart (if needed)
- [ ] Payment integration (VNPay/Momo)
- [ ] Order management system
- [ ] Customer accounts
- [ ] Loyalty program

---

## 🎯 Success Metrics

### Traffic Goals
- Week 1: 100+ visitors
- Month 1: 1,000+ visitors
- Month 3: 5,000+ visitors

### Engagement
- Avg session duration: > 2 minutes
- Bounce rate: < 60%
- Pages per session: > 3

### Conversions
- Click-through rate to Messenger: > 2%
- Response rate on Messenger: > 80%
- Sales conversion: > 5%

---

## 📞 Emergency Contacts

- **Vercel Support:** https://vercel.com/support
- **Next.js Discord:** https://nextjs.org/discord
- **Developer:** [Your contact]

---

## 🎉 Launch Day!

**Khi mọi thứ sẵn sàng:**

1. [ ] Final check all items above
2. [ ] Deploy to production
3. [ ] Announce on social media
4. [ ] Share link with friends/family
5. [ ] Start monitoring analytics
6. [ ] Celebrate! 🎊

---

**Last Updated:** [Ngày deploy]
**Version:** 1.0.0
**Status:** ⏳ Pre-Production

---

**🏮 Tharo - Áo Dài Truyền Thống Việt Nam** 🇻🇳

