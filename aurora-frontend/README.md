# Delete the file after successful development

# 🚀 Aurora Hotel System - Routes Testing Guide

Server đang chạy tại: **http://localhost:3000**

---

## � GUEST ROUTES (Khách vãng lai - Public, không cần đăng nhập)
**Layout:** ClientPage (với ClientHeader & ClientFooter)

### Trang chính
- 🏠 **Home**: http://localhost:3000/
- ℹ️ **About**: http://localhost:3000/about
- 🏨 **Accommodation (Phòng tiêu biểu)**: http://localhost:3000/accommodation
- 🛎️ **Service (Dịch vụ tiêu biểu)**: http://localhost:3000/service
- 🏢 **Branches**: http://localhost:3000/branches
- 🛏️ **Rooms**: http://localhost:3000/rooms
- 📄 **Room Detail**: http://localhost:3000/rooms/1 *(thay 1 bằng room ID)*
- 🖼️ **Gallery**: http://localhost:3000/gallery
- 📰 **News**: http://localhost:3000/news
- 📞 **Contact**: http://localhost:3000/contact

### Quick Booking (Đặt phòng nhanh - không cần đăng nhập)
- ➕ **Create Booking**: http://localhost:3000/booking/new
- ✅ **Confirm Booking**: http://localhost:3000/booking/confirm

### Authentication (Xác thực)
- 🔐 **Login**: http://localhost:3000/login
- 📝 **Register**: http://localhost:3000/register
- 🔑 **Forgot Password**: http://localhost:3000/forgot-password
- 🔓 **Reset Password**: http://localhost:3000/reset-password

---

## 🟢 CUSTOMER ROUTES (Khách hàng - Private, cần đăng nhập)
**Layout:** ClientPage (với ClientHeader & ClientFooter) - shared với GUEST

### Account (Tài khoản)
- 👤 **Profile**: http://localhost:3000/customer/profile
- ✏️ **Edit Profile**: http://localhost:3000/customer/profile/upsert

### Booking (Đặt phòng)
- 📋 **Booking List**: http://localhost:3000/customer/booking
- 📄 **Booking Detail**: http://localhost:3000/customer/booking/1 *(thay 1 bằng ID khác)*

### Favorites (Yêu thích)
- ⭐ **Favorites**: http://localhost:3000/customer/favorites

### Requests (Yêu cầu)
- 🕐 **Late Checkout Requests**: http://localhost:3000/customer/late-checkout-requests
- ➕ **New Late Checkout Request**: http://localhost:3000/customer/late-checkout-requests/upsert
- ⏰ **Early Checkin Requests**: http://localhost:3000/customer/early-checkin-requests
- ➕ **New Early Checkin Request**: http://localhost:3000/customer/early-checkin-requests/upsert
- � **Issue Reports**: http://localhost:3000/customer/issue-reports
- ➕ **New Issue Report**: http://localhost:3000/customer/issue-reports/upsert

### Reviews (Đánh giá)
- ⭐ **Reviews**: http://localhost:3000/customer/reviews
- ✍️ **Write Review**: http://localhost:3000/customer/reviews/upsert

### Payment (Thanh toán)
- � **Payment**: http://localhost:3000/customer/payment

---

## 🔴 ADMIN ROUTES (Quản trị viên - Red Theme)
**Layout:** AdminPage (riêng biệt)

### Dashboard
- 📊 **Admin Dashboard**: http://localhost:3000/admin

### Branches Management (Quản lý chi nhánh)
- 🏢 **Branch List**: http://localhost:3000/admin/branches
- ➕ **Create/Edit Branch**: http://localhost:3000/admin/branches/upsert
- 📄 **Branch Detail**: http://localhost:3000/admin/branches/1 *(thay 1 bằng ID khác)*

### Users Management (Quản lý người dùng)
- 👥 **User List**: http://localhost:3000/admin/users
- ➕ **Create/Edit User**: http://localhost:3000/admin/users/upsert
- 🎭 **Role Management**: http://localhost:3000/admin/roles

### Documents Management (Quản lý tài liệu)
- 📁 **Documents**: http://localhost:3000/admin/documents
- ➕ **Upload Document**: http://localhost:3000/admin/documents/upsert

### Reports (Báo cáo)
- � **Overview Report**: http://localhost:3000/admin/reports/overview
- �💰 **Revenue Report**: http://localhost:3000/admin/reports/revenue
- 📈 **Occupancy Report**: http://localhost:3000/admin/reports/occupancy
- 🏢 **Branch Comparison**: http://localhost:3000/admin/reports/branch-comparison

---

## 🔵 STAFF ROUTES (Nhân viên - Blue Theme)
**Layout:** StaffPage (riêng biệt)

### Dashboard
- 📊 **Staff Dashboard**: http://localhost:3000/staff

### Bookings Management (Quản lý đặt phòng)
- 📋 **Booking List**: http://localhost:3000/staff/booking
- ➕ **Create Booking**: http://localhost:3000/staff/booking/upsert
- 📄 **Booking Detail**: http://localhost:3000/staff/booking/1 *(thay 1 bằng ID khác)*
- ✅ **Check-in**: http://localhost:3000/staff/checkin
- 🚪 **Check-out**: http://localhost:3000/staff/checkout

### Customers Management (Quản lý khách hàng)
- ➕ **Create Customer**: http://localhost:3000/staff/customers/upsert

### Requests Management (Quản lý yêu cầu)
- � **Customer Requests**: http://localhost:3000/staff/customer-requests
- � **Late Checkout Requests**: http://localhost:3000/staff/customer-requests/late-checkout
- ⏰ **Early Checkin Requests**: http://localhost:3000/staff/customer-requests/early-checkin
- 🚨 **Issue Reports**: http://localhost:3000/staff/customer-requests/issue-reports

### Reports (Báo cáo)
- 📊 **Shift Report**: http://localhost:3000/staff/reports/shift

---

## � MANAGER ROUTES (Quản lý - Orange Theme)
**Layout:** ManagerPage (riêng biệt)

### Dashboard
- 📊 **Manager Dashboard**: http://localhost:3000/manager

### Rooms Management (Quản lý phòng)
- �️ **Room List**: http://localhost:3000/manager/rooms
- ➕ **Create/Edit Room**: http://localhost:3000/manager/rooms/upsert
- 🏷️ **Room Types**: http://localhost:3000/manager/room-types
- ➕ **Create/Edit Room Type**: http://localhost:3000/manager/room-types/upsert

### Services Management (Quản lý dịch vụ)
- �️ **Service List**: http://localhost:3000/manager/services
- ➕ **Create/Edit Service**: http://localhost:3000/manager/services/upsert

### Customers Management (Quản lý khách hàng)
- � **Customer List**: http://localhost:3000/manager/customers
- ➕ **Create/Edit Customer**: http://localhost:3000/manager/customers/upsert
- 📄 **Customer Detail**: http://localhost:3000/manager/customers/1 *(thay 1 bằng ID khác)*

### Staff Management (Quản lý nhân viên)
- 👨‍� **Staff List**: http://localhost:3000/manager/staff
- ➕ **Create/Edit Staff**: http://localhost:3000/manager/staff/upsert
- 🏢 **Assign Branch**: http://localhost:3000/manager/staff/1/assign-branch *(thay 1 bằng ID khác)*

### Promotions Management (Quản lý khuyến mãi)
- 🎁 **Promotion List**: http://localhost:3000/manager/promotions
- ➕ **Create/Edit Promotion**: http://localhost:3000/manager/promotions/upsert

### News Management (Quản lý tin tức)
- 📰 **News List**: http://localhost:3000/manager/news
- ➕ **Create/Edit News**: http://localhost:3000/manager/news/upsert

### Reports (Báo cáo)
- 💰 **Revenue Report**: http://localhost:3000/manager/reports/revenue
- 📈 **Occupancy Report**: http://localhost:3000/manager/reports/occupancy

---

## 🎯 Tổng kết

### Kiến trúc hệ thống:
```
pages/
├── client/              (ClientPage layout - shared)
│   ├── index.tsx       (ClientPage với ClientHeader & ClientFooter)
│   ├── guest/          (14 routes - không cần đăng nhập)
│   └── customer/       (17 routes - yêu cầu đăng nhập)
├── staff/              (12 routes - StaffPage layout)
├── manager/            (19 routes - ManagerPage layout)
└── admin/              (12 routes - AdminPage layout)
```

### Tổng số routes:
- **GUEST**: 16 routes (public - không cần đăng nhập)
- **CUSTOMER**: 14 routes (private - yêu cầu đăng nhập)
- **STAFF**: 12 routes (nhân viên khách sạn)
- **MANAGER**: 19 routes (quản lý chi nhánh)
- **ADMIN**: 12 routes (quản trị hệ thống)
- **TOTAL**: **73 routes**

### Layout phân cấp:
- **ClientPage** (RootPage): Shared cho GUEST và CUSTOMER
  - Có ClientHeader và ClientFooter chung
  - GUEST sử dụng root paths (/, /rooms, /services, ...)
  - CUSTOMER sử dụng prefixed paths (/customer/profile, /customer/booking, ...)
  
- **StaffPage**: Riêng cho nhân viên (Blue Theme)
- **ManagerPage**: Riêng cho quản lý (Orange Theme)  
- **AdminPage**: Riêng cho quản trị viên (Red Theme)

---

## 🛠️ Hướng dẫn Test

1. **Khởi động server** (nếu chưa chạy):
   ```bash
   npm run dev
   ```

2. **Mở trình duyệt** và truy cập: http://localhost:3000

3. **Test từng route** bằng cách click vào các link ở trên

4. **Lưu ý**:
   - Routes có `/:id` cần thay số ID (ví dụ: `/rooms/1`, `/rooms/2`, etc.)
   - Private routes yêu cầu đăng nhập (có thể chưa có logic redirect)
   - Admin/Staff routes cần có role phù hợp (có thể chưa có logic kiểm tra)
   - Hệ thống quản lý **1 khách sạn duy nhất** với nhiều phòng

---

## 📝 Notes

- ✅ Tất cả các trang đã được tạo với base structure
- ✅ Router đã được cấu hình đầy đủ
- ✅ Function components đã được đổi tên với hậu tố "Page"
- ⏳ Chưa có logic xác thực và phân quyền (sẽ implement sau)
- ⏳ Chưa có kết nối API và database (sẽ implement sau)
- ⏳ Chưa có i18n/translation (sẽ implement sau)

---

**🎨 Color Theme:**
- 🟢 Client: Green Theme
- 🔴 Admin: Red Theme  
- 🔵 Staff: Blue Theme

---

*Generated on: October 12, 2025*
*Project: Aurora Hotel System*
*Version: 1.0.0*
