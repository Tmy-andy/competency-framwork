# Hệ Thống Đánh Giá Năng Lực Nhân Viên

## 📋 Tính Năng

### 🔐 Xác Thực & Phân Quyền

#### **Admin (Quản trị viên)**
- ✅ Xem Dashboard tổng quan
- ✅ Quản lý danh sách nhân viên
- ✅ Tạo đánh giá năng lực cho nhân viên
- ✅ Xem báo cáo và thống kê
- ✅ Quản lý khung năng lực
- ✅ Quản lý cửa hàng và vị trí
- ✅ Toàn quyền truy cập tất cả trang

#### **User (Nhân viên)**
- ✅ Chỉ xem hồ sơ năng lực của chính mình
- ✅ Xem kết quả đánh giá cá nhân
- ✅ Xem lịch sử phân loại
- ✅ Không thể truy cập các trang quản lý

## 🔑 Tài Khoản Demo

### Admin
- **Username**: `admin`
- **Password**: `123456`
- **Quyền**: Toàn quyền truy cập

### Nhân viên 1
- **Username**: `user1`
- **Password**: `123456`
- **Mã NV**: NV001
- **Tên**: Nguyễn Văn A

### Nhân viên 2
- **Username**: `user2`
- **Password**: `123456`
- **Mã NV**: NV002
- **Tên**: Trần Thị B

## 🚀 Cách Sử Dụng

### 1. Đăng Nhập
1. Mở file `login.html` trong trình duyệt
2. Nhập username và password
3. Click "Đăng nhập"
4. Hệ thống tự động chuyển hướng theo quyền:
   - **Admin** → Dashboard (index.html)
   - **User** → Hồ sơ cá nhân (nhan-vien-infor.html)

### 2. Đăng Xuất
- Click nút "Đăng xuất" ở sidebar
- Xác nhận đăng xuất
- Tự động quay về trang login

### 3. Tính Năng Bảo Mật
- ✅ Tự động kiểm tra đăng nhập khi vào trang
- ✅ Chuyển về login nếu chưa đăng nhập
- ✅ Phân quyền tự động theo role
- ✅ Ghi nhớ đăng nhập (checkbox "Ghi nhớ")
- ✅ Ẩn menu admin với tài khoản user

## 📁 Cấu Trúc File

```
📦 ĐGNL/
├── 🔐 login.html              # Trang đăng nhập
├── 🔐 login.js                # Logic đăng nhập
├── 🔐 auth.js                 # Xác thực & phân quyền
├── 📊 index.html              # Dashboard (Admin)
├── 👥 nhan-vien.html          # Danh sách nhân viên (Admin)
├── 👤 nhan-vien-infor.html    # Hồ sơ nhân viên (Admin & User)
├── ✍️ danh-gia-nang-luc.html  # Tạo đánh giá (Admin)
├── 📈 bao-cao.html            # Báo cáo (Admin)
├── 📚 quan-ly-nang-luc.html   # Quản lý khung năng lực (Admin)
├── 🏪 quan-ly-cua-hang.html   # Quản lý cửa hàng (Admin)
├── 💼 quan-ly-vi-tri.html     # Quản lý vị trí (Admin)
└── 📋 sidebar.html            # Menu sidebar
```

## 🎨 Giao Diện

### Trang Login
- Form đơn giản với username/password
- Toggle hiển thị/ẩn mật khẩu
- Checkbox "Ghi nhớ đăng nhập"
- Thông báo lỗi khi sai tài khoản
- Gradient background đẹp mắt

### Hồ Sơ Nhân Viên (User View)
- **Cột trái**:
  - Thông tin cá nhân và avatar
  - Mức năng lực hiện tại (biểu đồ tròn)
  - Lịch sử phân loại (timeline)
  
- **Cột phải**:
  - Bảng đánh giá 38 năng lực
  - Cấp độ với màu sắc (Level 1-4)
  - Ghi chú/Nhận xét

### Admin View
- Toàn bộ menu hiển thị
- Truy cập mọi trang
- Tên hiển thị: "Quản trị viên"

## 💾 Lưu Trữ Dữ Liệu

Sử dụng **localStorage** để lưu:
- `currentUser`: Thông tin user đang đăng nhập
- `rememberedUser`: Username được ghi nhớ
- Các dữ liệu đánh giá năng lực

## 🔧 Công Nghệ Sử Dụng

- **HTML5**
- **TailwindCSS** - Styling
- **JavaScript** (Vanilla)
- **LocalStorage** - Lưu trữ
- **Material Symbols** - Icons
- **Font Awesome** - Icons (login page)

## 📝 Ghi Chú

1. **Bảo mật**: Hệ thống demo, không dùng cho production
2. **Dữ liệu**: Lưu trữ local, không có backend
3. **Session**: Lưu trong localStorage, không expire
4. **Mật khẩu**: Demo password đơn giản (123456)

## 🛠️ Phát Triển Tiếp

- [ ] Backend API integration
- [ ] Database persistence
- [ ] Password hashing
- [ ] Session timeout
- [ ] Role-based features advanced
- [ ] Email notifications
- [ ] Export PDF reports
- [ ] Multi-language support

---

**Version**: 1.0.0  
**Last Updated**: December 2025
