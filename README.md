# 🌟 Trịnh Hữu Dưỡng - Portfolio & Interactive CV Web

> Trang web giới thiệu năng lực kỹ sư phần mềm, hệ sinh thái công nghệ tích lũy và quy trình ứng dụng **AI Agent (.agents)** đột phá trong phát triển phần mềm.

---

## 📌 Tính Năng Nổi Bật

1. **Giao Diện Đột Phá & Hiện Đại (Obsidian + Emerald Glow & Neon Cyan)**:
   - Phong cách thiết kế hiện đại, khác biệt hoàn toàn với màu sắc cũ.
   - Hiệu ứng ánh sáng neon, card glassmorphism mờ ảo, micro-interactions sống động.
   - Thân thiện hoàn toàn trên thiết bị di động (Responsive 100%).

2. **Chuyên Mục AI Engineering & Agentic Workflows (`.agents`)**:
   - Trình bày sâu sắc phương pháp làm việc cùng AI Agent từ thực tế các dự án:
     - `G:\2026\new-fetch\.agents` (Master Framework 3-Pha, TDD, Domain-Driven Knowledge Base).
     - `G:\2026\nha-tro\.agents` (Skill Dispatch Matrix).
     - `G:\2026\chat-duon-guy` (Taste-Skill Anti-Slop & Impeccable Design rules).
   - Mô phỏng tương tác chuyển tab trực quan kèm code terminal mẫu.

3. **8 Dự Án Thực Chiến Hoàn Chỉnh**:
   - **FetchCRM** (Next.js 16, NestJS, BullMQ, Redis, PostgreSQL, Drizzle ORM, Zalo API, .agents).
   - **DuongUy Chat** (NestJS, Next.js 16, React 19, Dexie Offline-first, Capacitor Mobile & Electron Desktop).
   - **Smart Living & Quản lý Nhà Trọ** (Angular 19, Capacitor, Firebase, SePAY Webhook, IoT Cloud Lock).
   - **Khung Nhôm Kính E-Commerce & Báo Giá** (NestJS, Next.js 16, Drizzle ORM, TipTap CMS).
   - **MeatDeli.com.vn** (Masan Group - QR Code Quality Traceability, Laravel, MySQL, CI/CD).
   - **Cổng Nạp Tiền Tự Động 3CX QR** (Telecom VietQR Gateway, Laravel, ReactJS, Telegram Bot).
   - **Công Cụ Quản Lý Dự Án & Dự Toán Doanh Nghiệp** (Bitrix24 2-way Async API, Costing Engine).
   - **Hiện Đại Hóa Masan Bitrix & AWS Cloud** (PHP 5.6 -> 8.3 zero-downtime, CentOS 7, 3CX Voice Mount).

4. **Tính Năng Tiện Ích Tuyển Dụng**:
   - Nút **Xem CV Online**: Mở Modal xem CV chuẩn formatted A4 với nút "In / Lưu PDF" (`window.print()`).
   - Nút **Tải CV (PDF)**: Tải trực tiếp file CV gốc (bản Tiếng Việt & Tiếng Anh).
   - Nút **Copy 1-Click**: Tự động sao chép Email và Số điện thoại kèm thông báo Toast sinh động.
   - Bộ lọc dự án theo chuyên mục: All, AI & Full-Stack 2026, Enterprise LET Corp, Cloud Ops.

---

## 🚀 Hướng Dẫn Chạy Thử Tại Local

### Cách 1: Chạy bằng Node.js / NPM (Khuyến nghị)
Mở terminal tại thư mục `E:\chung\CV\duong-cv`:
```bash
npm run dev
```
Trang web sẽ tự động khởi chạy tại: `http://localhost:3000`

### Cách 2: Mở trực tiếp trên Trình Duyệt (Chrome / Edge / Firefox)
Click đúp chuột trực tiếp vào tệp `index.html` trong thư mục `E:\chung\CV\duong-cv`. Toàn bộ giao diện và tính năng đều hiển thị trọn vẹn.

---

## ☁️ Hướng Dẫn Triển Khai Lên Vercel (Để Gửi Link Ứng Tuyển)

1. Cài đặt Vercel CLI (nếu chưa có):
   ```bash
   npm i -g vercel
   ```
2. Mở terminal tại thư mục `E:\chung\CV\duong-cv` và gõ:
   ```bash
   vercel
   ```
3. Làm theo hướng dẫn trên màn hình (nhấn Enter để chọn mặc định). Trong vòng 1 phút, bạn sẽ nhận được một đường link public tuyệt đẹp (ví dụ: `https://duongtrinh-cv.vercel.app`) để nộp cho Nhà Tuyển Dụng!

---

## 📁 Cấu Trúc Thư Mục

```
duong-cv/
├── assets/
│   ├── 1.png                         # Ảnh đại diện chính thức
│   ├── images.png                    # Favicon chính thức của trang web
│   ├── CV-Trinh-Huu-Duong-VN.pdf     # Bản CV PDF Tiếng Việt chính thức
│   ├── CV-Trinh-Huu-Duong-EN.pdf     # Bản CV PDF Tiếng Anh chính thức
│   └── ...                           # Icon & hình ảnh bổ trợ
├── css/
│   └── styles.css                    # Toàn bộ hiệu ứng Emerald/Cyan, Glassmorphism & Print styling
├── js/
│   ├── app.js                        # Xử lý logic tab AI, modal CV, toast, filter dự án
│   └── projectsCarousel.js           # Xử lý carousel Swiper
├── index.html                        # Giao diện chính đầy đủ, responsive & SEO-friendly
├── package.json                      # Cấu hình scripts chạy dev / preview
├── profile.md                        # Hồ sơ lý lịch kỹ thuật chi tiết dạng Markdown
└── README.md                         # Hướng dẫn này
```
