# 📋 Aurora Hotel System - Task Distribution List

---

## 🎯 TỔNG QUAN PHÂN CÔNG BACKEND

### 👥 Phân Chia Công Việc Backend (2 Developers)

**Team Backend:**
- **Developer A (Nguyễn Văn Minh)** - Focus: Reviews & Customer Services
- **Developer B (Nguyễn Duy Khải)** - Focus: Analytics & Notifications

---

## 👨‍💻 DEVELOPER A - Nguyễn Văn Minh
**Chủ đề:** Review & Customer Experience Features

### 📦 MODULE 1: Review & Rating System

#### Mô tả:
Xây dựng hệ thống đánh giá và rating cho hotel, rooms, và services. Customers có thể để lại reviews sau khi checkout, managers có thể moderate (approve/reject) reviews.

#### Deliverables:
```
1. Entity: Review.java
   - Fields: booking, customer, branch, room, rating (1-5), comment, photos, 
             isVerified, helpfulCount, status, reviewDate
   - Relationships: ManyToOne với Booking, User, Branch, Room

2. Repository: ReviewRepository.java
   - Methods: findByBranch, findByCustomer, findByRoom, 
              calculateAverageRating, findTopRated

3. Service: ReviewService.java & ReviewServiceImpl.java
   - createReview() - validation: customer đã checkout
   - updateReview() - chỉ cho phép edit trong 24h
   - deleteReview() - soft delete
   - approveReview() - cho Manager/Admin
   - rejectReview() - với lý do
   - getReviewsByBranch() - có pagination
   - getReviewStatistics() - avg rating, count by stars

4. DTOs:
   - ReviewCreationRequest (rating, comment, photos)
   - ReviewUpdateRequest
   - ReviewResponse (include customer info, booking code)
   - ReviewStatistics (avgRating, totalReviews, ratingDistribution)

5. Controller: ReviewController.java
   - POST   /reviews - tạo review
   - PUT    /reviews/{id} - update review
   - DELETE /reviews/{id} - xóa review
   - GET    /reviews/{id} - chi tiết
   - GET    /reviews/branch/{branchId} - list reviews
   - GET    /reviews/room/{roomId} - reviews của room
   - GET    /reviews/my-reviews - customer's own reviews
   - PATCH  /reviews/{id}/approve - approve
   - PATCH  /reviews/{id}/reject - reject
   - GET    /reviews/statistics/branch/{branchId}

6. Permissions:
   - REVIEW_CREATE (Customer)
   - REVIEW_UPDATE_OWN (Customer)
   - REVIEW_DELETE_OWN (Customer)
   - REVIEW_VIEW_ALL (Staff, Manager, Admin)
   - REVIEW_MODERATE (Manager, Admin)
```

#### Business Rules:
- ✅ Chỉ customers đã checkout mới có thể review
- ✅ Mỗi booking chỉ được review 1 lần
- ✅ Rating từ 1-5 stars (required)
- ✅ Comment tối thiểu 10 ký tự
- ✅ Photos tối đa 5 ảnh
- ✅ Reviews pending phải được approve mới hiển thị public
- ✅ Helpful count để sort reviews hữu ích nhất

---

### 📦 MODULE 2: Customer Request System

#### Mô tả:
Hệ thống quản lý các yêu cầu từ khách hàng như: early check-in, late checkout, room change, issue reports, special requests, housekeeping requests.

#### Deliverables:
```
1. Entity: CustomerRequest.java
   - Fields: booking, customer, requestType, title, description, 
             priority, status, assignedTo, requestedDate, resolvedDate, resolution
   - Enums: RequestType, Priority, RequestStatus

2. Repository: CustomerRequestRepository.java
   - Methods: findByCustomer, findByBooking, findByAssignedTo,
              findPendingRequests, findByStatusAndPriority

3. Service: CustomerRequestService.java
   - createRequest() - auto-assign based on request type
   - updateRequest()
   - assignRequest(requestId, staffId)
   - resolveRequest(requestId, resolution)
   - rejectRequest(requestId, reason)
   - getMyRequests() - customer's requests
   - getAssignedRequests() - staff's assigned requests
   - getAllRequests() - with filters

4. DTOs:
   - CustomerRequestCreationRequest
   - CustomerRequestUpdateRequest
   - CustomerRequestResponse (include customer, booking, assigned staff info)
   - RequestStatistics (count by status, priority)

5. Controller: CustomerRequestController.java
   - POST   /requests - tạo request
   - PUT    /requests/{id} - update
   - DELETE /requests/{id} - cancel request
   - GET    /requests/{id} - detail
   - GET    /requests/my-requests - customer's requests
   - GET    /requests/assigned - staff's assigned requests
   - GET    /requests - all (for managers)
   - PATCH  /requests/{id}/assign - assign to staff
   - PATCH  /requests/{id}/resolve - mark resolved
   - PATCH  /requests/{id}/reject - reject request

6. Permissions:
   - REQUEST_CREATE (Customer)
   - REQUEST_VIEW_OWN (Customer)
   - REQUEST_UPDATE_OWN (Customer)
   - REQUEST_VIEW_ALL (Staff, Manager, Admin)
   - REQUEST_ASSIGN (Manager)
   - REQUEST_RESOLVE (Staff, Manager)
```

#### Business Rules:
- ✅ Request type quyết định priority mặc định
- ✅ URGENT requests auto-notify manager
- ✅ Staff chỉ thấy requests được assign cho mình
- ✅ Customer có thể cancel request nếu status = PENDING
- ✅ Resolved requests không thể edit
- ✅ Issue reports auto-assign cho housekeeping staff

---

### 📦 MODULE 3: Favorite Rooms System

#### Mô tả:
Cho phép customers lưu danh sách rooms/room types yêu thích để dễ dàng booking sau này.

#### Deliverables:
```
1. Entity: FavoriteRoom.java
   - Fields: customer, room, roomType, note, addedDate
   - UniqueConstraint: (customer_id, room_id)

2. Repository: FavoriteRoomRepository.java
   - Methods: findByCustomer, existsByCustomerAndRoom,
              deleteByCustomerAndRoom, countByCustomer

3. Service: FavoriteRoomService.java
   - addFavorite(roomId) hoặc addFavoriteRoomType(roomTypeId)
   - removeFavorite(roomId)
   - getMyFavorites()
   - isFavorite(roomId)
   - clearAllFavorites()

4. DTOs:
   - FavoriteRoomRequest (roomId, note)
   - FavoriteRoomResponse (include room/roomType details)

5. Controller: FavoriteRoomController.java
   - POST   /favorites/rooms/{roomId} - add to favorite
   - DELETE /favorites/rooms/{roomId} - remove
   - GET    /favorites/my-favorites - list favorites
   - GET    /favorites/rooms/{roomId}/is-favorite - check
   - DELETE /favorites/clear - clear all

6. Permissions:
   - FAVORITE_MANAGE_OWN (Customer)
```

#### Business Rules:
- ✅ Chỉ customers mới có favorites
- ✅ Mỗi customer tối đa 20 favorites
- ✅ Khi room bị xóa (soft delete), auto-remove khỏi favorites
- ✅ Sort favorites theo addedDate DESC

---

### 📊 Tổng Kết Developer A:
- **Tổng Entities:** 3 (Review, CustomerRequest, FavoriteRoom)
- **Tổng Endpoints:** ~35 endpoints
- **Timeline:** 11 ngày (2.2 tuần)
- **Difficulty:** Trung bình, có nhiều business logic nhưng đơn giản

---

## 👨‍💻 DEVELOPER B - Nguyễn Duy Khải
**Chủ đề:** Analytics, Reporting & Notification Features

### 📦 MODULE 1: Dashboard & Statistics APIs

#### Mô tả:
Xây dựng các APIs cho dashboard admin/manager với các chỉ số thống kê: revenue, bookings, occupancy rate, customer analytics.

#### Deliverables:
```
1. Service: DashboardService.java
   - Methods tính toán statistics:
     * getTotalRevenue(dateFrom, dateTo, branchId)
     * getTotalBookings(dateFrom, dateTo, status, branchId)
     * getOccupancyRate(date, branchId)
     * getAverageBookingValue(dateFrom, dateTo)
     * getTopSellingRoomTypes(limit, branchId)
     * getCustomerGrowth(period)
     * getRevenueByPaymentMethod(dateFrom, dateTo)
     * getBookingsBySource(dateFrom, dateTo)

2. DTOs:
   - DashboardOverviewResponse
     {
       totalRevenue: BigDecimal,
       totalBookings: Integer,
       occupancyRate: Double,
       avgBookingValue: BigDecimal,
       newCustomers: Integer,
       returningCustomers: Integer,
       revenueGrowth: Double (%)
     }
   
   - RevenueStatistics
     {
       period: String (DAY/WEEK/MONTH),
       revenue: BigDecimal,
       bookingCount: Integer,
       avgValue: BigDecimal
     }

   - OccupancyStatistics
     {
       date: LocalDate,
       totalRooms: Integer,
       occupiedRooms: Integer,
       availableRooms: Integer,
       occupancyRate: Double (%)
     }

3. Controller: DashboardController.java
   - GET /dashboard/admin/overview - tổng quan toàn hệ thống
   - GET /dashboard/manager/branch/{branchId} - thống kê branch
   - GET /dashboard/staff - thống kê cho staff
   - GET /dashboard/revenue?dateFrom=&dateTo=&branchId=
   - GET /dashboard/occupancy?date=&branchId=
   - GET /dashboard/top-rooms?limit=10&branchId=
   - GET /dashboard/customer-growth?period=MONTH

4. Repository Queries:
   - Custom queries trong BookingRepository, PaymentRepository
   - @Query với aggregate functions (SUM, COUNT, AVG)
   - GROUP BY date, branch, room type

5. Permissions:
   - DASHBOARD_VIEW_ADMIN (Admin)
   - DASHBOARD_VIEW_MANAGER (Manager)
   - DASHBOARD_VIEW_STAFF (Staff)
```

#### Business Rules:
- ✅ Admin xem tất cả branches
- ✅ Manager chỉ xem branch được assign
- ✅ Staff xem limited statistics
- ✅ Cache dashboard data 5 phút (sử dụng @Cacheable)
- ✅ Occupancy rate = (Occupied Rooms / Total Rooms) * 100
- ✅ Revenue growth so với period trước

---

### 📦 MODULE 2: Reporting APIs

#### Mô tả:
Xây dựng các APIs để generate reports chi tiết: revenue report, occupancy report, booking trends, branch comparison.

#### Deliverables:
```
1. Service: ReportService.java
   - generateRevenueReport(dateFrom, dateTo, branchId, groupBy)
   - generateOccupancyReport(dateFrom, dateTo, branchId)
   - generateBookingTrendReport(dateFrom, dateTo)
   - generateBranchComparisonReport(dateFrom, dateTo)
   - generateServicePerformanceReport(dateFrom, dateTo, branchId)
   - generateCustomerAnalyticsReport(dateFrom, dateTo)

2. DTOs:
   - RevenueReportResponse
     {
       period: String,
       reportData: List<RevenueByPeriod>,
       totalRevenue: BigDecimal,
       revenueByPaymentMethod: Map<PaymentMethod, BigDecimal>,
       revenueByRoomType: List<RoomTypeRevenue>
     }

   - OccupancyReportResponse
     {
       period: String,
       occupancyData: List<OccupancyByDate>,
       avgOccupancyRate: Double,
       peakOccupancyDate: LocalDate,
       lowestOccupancyDate: LocalDate
     }

   - BookingTrendResponse
     {
       trendData: List<BookingByPeriod>,
       totalBookings: Integer,
       cancelledBookings: Integer,
       cancellationRate: Double,
       avgLeadTime: Integer (days before checkin)
     }

   - BranchComparisonResponse
     {
       branches: List<BranchPerformance>,
       topPerformer: String (branchId),
       lowestPerformer: String (branchId)
     }

3. Controller: ReportController.java
   - GET /reports/revenue?dateFrom=&dateTo=&branchId=&groupBy=DAY
   - GET /reports/occupancy?dateFrom=&dateTo=&branchId=
   - GET /reports/booking-trends?dateFrom=&dateTo=
   - GET /reports/branch-comparison?dateFrom=&dateTo=
   - GET /reports/service-performance?dateFrom=&dateTo=&branchId=
   - GET /reports/customer-analytics?dateFrom=&dateTo=

4. Features:
   - Group by: DAY, WEEK, MONTH, YEAR
   - Export format: JSON (PDF/Excel để Frontend handle)
   - Date range validation (max 1 year)

5. Permissions:
   - REPORT_GENERATE_ADMIN (Admin)
   - REPORT_GENERATE_MANAGER (Manager - own branch only)
```

#### Business Rules:
- ✅ Reports chỉ dùng data đã completed/confirmed
- ✅ Cancelled bookings không tính vào revenue nhưng hiện trong trends
- ✅ Branch comparison chỉ compare active branches
- ✅ Service performance dựa trên booking count và revenue
- ✅ Customer analytics: new vs returning, lifetime value

---

### 📦 MODULE 3: Notification System

#### Mô tả:
Hệ thống thông báo trong app cho users về booking updates, payment confirmations, requests updates.

#### Deliverables:
```
1. Entity: Notification.java
   - Fields: recipient, title, message, type, relatedEntityType,
             relatedEntityId, isRead, readAt, priority, expiryDate
   - Enums: NotificationType, Priority

2. Repository: NotificationRepository.java
   - Methods: findByRecipient, findUnreadByRecipient,
              countUnreadByRecipient, markAsRead, deleteExpired

3. Service: NotificationService.java
   - createNotification(userId, title, message, type)
   - sendBookingConfirmation(bookingId)
   - sendPaymentReceived(paymentId)
   - sendCheckoutReminder(bookingId) - 1 day before
   - sendRequestUpdated(requestId)
   - getMyNotifications(pageable)
   - markAsRead(notificationId)
   - markAllAsRead()
   - deleteNotification(notificationId)
   - getUnreadCount()

4. DTOs:
   - NotificationResponse
   - NotificationCreationRequest
   - UnreadCountResponse

5. Controller: NotificationController.java
   - GET    /notifications/my-notifications - list
   - GET    /notifications/unread-count
   - PATCH  /notifications/{id}/read - mark as read
   - PATCH  /notifications/read-all - mark all read
   - DELETE /notifications/{id} - delete

6. Event Listeners (sử dụng Spring Events):
   - @EventListener onBookingConfirmed
   - @EventListener onPaymentReceived
   - @EventListener onRequestStatusChanged
   - @Scheduled task để send checkout reminders

7. Permissions:
   - NOTIFICATION_VIEW_OWN (All users)
```

#### Business Rules:
- ✅ Notifications tự động tạo khi có events
- ✅ Expiry sau 30 ngày (auto-delete bằng scheduled task)
- ✅ URGENT notifications hiển thị đầu tiên
- ✅ Users chỉ xem notifications của mình
- ✅ Checkout reminder gửi lúc 9AM ngày trước checkout

---

### 📊 Tổng Kết Developer B:
- **Tổng Modules:** 3 (Dashboard, Reporting, Notification)
- **Tổng Endpoints:** ~25 endpoints
- **Difficulty:** Trung bình, nhiều logic tính toán nhưng straightforward
---

**Good luck team! Let's build an amazing hotel management system! 💪🌌**
