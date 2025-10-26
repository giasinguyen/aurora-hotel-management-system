import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "@/pages/commons/ErrorPage";

// ==================== CLIENT LAYOUT ====================
import ClientPage from "@/pages/client/index";

// ==================== GUEST PAGES (client/guest - không cần đăng nhập) ====================
import HomePage from "@/pages/client/guest/Home";
import AboutPage from "@/pages/client/guest/About";
import AccommodationPage from "@/pages/client/guest/Accommodation";
import ServicePage from "@/pages/client/guest/Service";
import GalleryPage from "@/pages/client/guest/Gallery";
import NewsPage from "@/pages/client/guest/News";
import ContactPage from "@/pages/client/guest/Contact";

// Guest - Branch & Room pages
import BranchListPage from "@/pages/client/guest/BranchList";
import GuestRoomListPage from "@/pages/client/guest/RoomList";
import GuestRoomDetailPage from "@/pages/client/guest/RoomDetail";

// Guest - Quick Booking pages
import QuickBookingPage from "@/pages/client/guest/booking/QuickBooking";
import QuickBookingConfirmPage from "@/pages/client/guest/booking/QuickBookingConfirm";

// Authentication pages
import LoginPage from "@/pages/client/guest/auth/Login";
import RegisterPage from "@/pages/client/guest/auth/Register";
import ForgotPasswordPage from "@/pages/client/guest/auth/ForgotPassword";
import ResetPasswordPage from "@/pages/client/guest/auth/ResetPassword";

// ==================== CUSTOMER PAGES (client/customer - cần đăng nhập) ====================
// Customer account & profile
import CustomerProfilePage from "@/pages/client/customer/account/Profile";
import ProfileUpsertPage from "@/pages/client/customer/account/ProfileUpsert";

// Customer bookings
import CustomerBookingListPage from "@/pages/client/customer/bookings/BookingList";
import CustomerBookingDetailPage from "@/pages/client/customer/bookings/BookingDetail";

// Customer favorites
import FavoriteListPage from "@/pages/client/customer/favorites/FavoriteList";


// Customer reviews
import ReviewListPage from "@/pages/client/customer/reviews/ReviewList";
import ReviewUpsertPage from "@/pages/client/customer/reviews/ReviewUpsert";

// Customer payment
import CustomerPaymentPage from "@/pages/client/customer/payment/PaymentPage";

// ==================== STAFF PAGES ====================
import StaffPage from "@/pages/staff/index";
import StaffDashboardPage from "@/pages/staff/dashboard/StaffDashboard";
import StaffBookingListPage from "@/pages/staff/bookings/BookingList";
import StaffBookingUpsertPage from "@/pages/staff/bookings/BookingUpsert";
import StaffBookingDetailPage from "@/pages/staff/bookings/BookingDetail";
import StaffCustomerUpsertPage from "@/pages/staff/customers/CustomerUpsert";
import ShiftReportPage from "@/pages/staff/reports/ShiftReport";

// ==================== MANAGER PAGES ====================
import ManagerPage from "@/pages/manager/index";
import ManagerDashboardPage from "@/pages/manager/dashboard/ManagerDashboard";
import ManagerRoomListPage from "@/pages/manager/rooms/RoomList";
import ManagerRoomUpsertPage from "@/pages/manager/rooms/RoomUpsert";
import RoomTypeListPage from "@/pages/manager/rooms/RoomTypeList";
import RoomTypeUpsertPage from "@/pages/manager/rooms/RoomTypeUpsert";
import ManagerServiceListPage from "@/pages/manager/services/ServiceList";
import ManagerServiceUpsertPage from "@/pages/manager/services/ServiceUpsert";
import ManagerCustomerListPage from "@/pages/manager/customers/CustomerList";
import ManagerCustomerUpsertPage from "@/pages/manager/customers/CustomerUpsert";
import ManagerCustomerDetailPage from "@/pages/manager/customers/CustomerDetail";
import ManagerStaffListPage from "@/pages/manager/staff/StaffList";
import ManagerStaffUpsertPage from "@/pages/manager/staff/StaffUpsert";
import AssignBranchPage from "@/pages/manager/staff/AssignBranch";
import ManagerPromotionListPage from "@/pages/manager/promotions/PromotionList";
import ManagerPromotionUpsertPage from "@/pages/manager/promotions/PromotionUpsert";
import ManagerNewsListPage from "@/pages/manager/news/NewsList";
import ManagerNewsUpsertPage from "@/pages/manager/news/NewsUpsert";
import ManagerRevenueReportPage from "@/pages/manager/reports/RevenueReport";
import ManagerOccupancyReportPage from "@/pages/manager/reports/OccupancyReport";

// ==================== ADMIN PAGES ====================
import AdminPage from "@/pages/admin/index";
import AdminDashboardPage from "@/pages/admin/dashboard/AdminDashboard";
import AdminBranchListPage from "@/pages/admin/branches/BranchList";
import AdminBranchUpsertPage from "@/pages/admin/branches/BranchUpsert";
import AdminUserListPage from "@/pages/admin/users/UserList";
import AdminUserUpsertPage from "@/pages/admin/users/UserUpsert";
import AdminRoleManagementPage from "@/pages/admin/users/RoleManagement";
import AdminDocumentListPage from "@/pages/admin/documents/DocumentList";
import AdminDocumentUpsertPage from "@/pages/admin/documents/DocumentUpsert";
import AdminOverviewReportPage from "@/pages/admin/reports/OverviewReport";
import AdminRevenueReportPage from "@/pages/admin/reports/RevenueReport";
import AdminOccupancyReportPage from "@/pages/admin/reports/OccupancyReport";
import AdminBranchComparisonReportPage from "@/pages/admin/reports/BranchComparisonReport";

// ==================== COMMON PAGES ====================
import UserProfilePage from "@/pages/commons/UserProfile";

const router = createBrowserRouter([
  // ==================== GUEST & CUSTOMER ROUTES (Using ClientPage Layout) ====================
  {
    path: "/",
    element: <ClientPage />,
    errorElement: <ErrorPage />,
    children: [
      // ==================== GUEST ROUTES (không cần đăng nhập) ====================
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "accommodation", element: <AccommodationPage /> },
      { path: "service", element: <ServicePage /> },
      { path: "branches", element: <BranchListPage /> },
      { path: "rooms", element: <GuestRoomListPage /> },
      { path: "rooms/:id", element: <GuestRoomDetailPage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "news", element: <NewsPage /> },
      { path: "contact", element: <ContactPage /> },
      
      // Guest - Quick Booking
      { path: "booking/new", element: <QuickBookingPage /> },
      { path: "booking/confirm", element: <QuickBookingConfirmPage /> },
      
      // Guest - Authentication
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },

      // ==================== CUSTOMER ROUTES (cần đăng nhập) ====================
      { path: "customer/profile", element: <CustomerProfilePage /> },
      { path: "customer/profile/upsert", element: <ProfileUpsertPage /> },
      { path: "customer/booking", element: <CustomerBookingListPage /> },
      { path: "customer/booking/:id", element: <CustomerBookingDetailPage /> },
      { path: "customer/favorites", element: <FavoriteListPage /> },
      { path: "customer/reviews", element: <ReviewListPage /> },
      { path: "customer/reviews/upsert", element: <ReviewUpsertPage /> },
      { path: "customer/payment", element: <CustomerPaymentPage /> },
    ],
  },

  // ==================== STAFF ROUTES ====================
  {
    path: "/staff",
    element: <StaffPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <StaffDashboardPage /> },
      
      // Quản lý đơn đặt phòng
      { path: "booking", element: <StaffBookingListPage /> },
      { path: "booking/upsert", element: <StaffBookingUpsertPage /> },
      { path: "booking/:id", element: <StaffBookingDetailPage /> },
      
      // Quản lý khách hàng (chỉ tạo/upsert)
      { path: "customers/upsert", element: <StaffCustomerUpsertPage /> },
      
      // Báo cáo ca làm việc
      { path: "reports/shift", element: <ShiftReportPage /> },
      
      // Profile
      { path: "profile", element: <UserProfilePage /> },
    ],
  },

  // ==================== MANAGER ROUTES ====================
  // Manager kế thừa tất cả chức năng của Staff + thêm chức năng riêng
  {
    path: "/manager",
    element: <ManagerPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ManagerDashboardPage /> },
      
      // ===== Kế thừa từ Staff =====
      // Quản lý đơn đặt phòng (từ Staff)
      { path: "booking", element: <StaffBookingListPage /> },
      { path: "booking/upsert", element: <StaffBookingUpsertPage /> },
      { path: "booking/:id", element: <StaffBookingDetailPage /> },
      
      // Báo cáo ca làm việc (từ Staff)
      { path: "reports/shift", element: <ShiftReportPage /> },
      
      // ===== Chức năng riêng của Manager =====
      // Quản lý phòng
      { path: "rooms", element: <ManagerRoomListPage /> },
      { path: "rooms/upsert", element: <ManagerRoomUpsertPage /> },
      { path: "room-types", element: <RoomTypeListPage /> },
      { path: "room-types/upsert", element: <RoomTypeUpsertPage /> },
      
      // Quản lý dịch vụ
      { path: "services", element: <ManagerServiceListPage /> },
      { path: "services/upsert", element: <ManagerServiceUpsertPage /> },
      
      // Quản lý khách hàng (đầy đủ: xem, tạo, sửa)
      { path: "customers", element: <ManagerCustomerListPage /> },
      { path: "customers/upsert", element: <ManagerCustomerUpsertPage /> },
      { path: "customers/:id", element: <ManagerCustomerDetailPage /> },
      
      // Quản lý nhân viên
      { path: "staff", element: <ManagerStaffListPage /> },
      { path: "staff/upsert", element: <ManagerStaffUpsertPage /> },
      { path: "staff/:id/assign-branch", element: <AssignBranchPage /> },
      
      // Quản lý khuyến mãi
      { path: "promotions", element: <ManagerPromotionListPage /> },
      { path: "promotions/upsert", element: <ManagerPromotionUpsertPage /> },
      
      // Quản lý tin tức
      { path: "news", element: <ManagerNewsListPage /> },
      { path: "news/upsert", element: <ManagerNewsUpsertPage /> },
      
      // Báo cáo doanh thu và công suất
      { path: "reports/revenue", element: <ManagerRevenueReportPage /> },
      { path: "reports/occupancy", element: <ManagerOccupancyReportPage /> },
      
      // Profile
      { path: "profile", element: <UserProfilePage /> },
    ],
  },

  // ==================== ADMIN ROUTES ====================
  // Admin kế thừa tất cả chức năng của Manager (và Staff) + thêm chức năng riêng
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      
      // ===== Kế thừa từ Staff =====
      // Quản lý đơn đặt phòng (từ Staff)
      { path: "booking", element: <StaffBookingListPage /> },
      { path: "booking/upsert", element: <StaffBookingUpsertPage /> },
      { path: "booking/:id", element: <StaffBookingDetailPage /> },
      
      // Báo cáo ca làm việc (từ Staff)
      { path: "reports/shift", element: <ShiftReportPage /> },
      
      // ===== Kế thừa từ Manager =====
      // Quản lý phòng (từ Manager)
      { path: "rooms", element: <ManagerRoomListPage /> },
      { path: "rooms/upsert", element: <ManagerRoomUpsertPage /> },
      { path: "room-types", element: <RoomTypeListPage /> },
      { path: "room-types/upsert", element: <RoomTypeUpsertPage /> },
      
      // Quản lý dịch vụ (từ Manager)
      { path: "services", element: <ManagerServiceListPage /> },
      { path: "services/upsert", element: <ManagerServiceUpsertPage /> },
      
      // Quản lý khuyến mãi (từ Manager)
      { path: "promotions", element: <ManagerPromotionListPage /> },
      { path: "promotions/upsert", element: <ManagerPromotionUpsertPage /> },
      
      // Quản lý tin tức (từ Manager)
      { path: "news", element: <ManagerNewsListPage /> },
      { path: "news/upsert", element: <ManagerNewsUpsertPage /> },
      
      // ===== Chức năng riêng của Admin =====
      // Quản lý chi nhánh
      { path: "branches", element: <AdminBranchListPage /> },
      { path: "branches/upsert", element: <AdminBranchUpsertPage /> },
      
      // Quản lý User System (bao gồm tất cả: Staff, Manager, Customer)
      { path: "users", element: <AdminUserListPage /> },
      { path: "users/upsert", element: <AdminUserUpsertPage /> },
      { path: "roles", element: <AdminRoleManagementPage /> },
      
      // Quản lý tài liệu
      { path: "documents", element: <AdminDocumentListPage /> },
      { path: "documents/upsert", element: <AdminDocumentUpsertPage /> },
      
      // Báo cáo tổng quát (gồm tất cả các role)
      { path: "reports/overview", element: <AdminOverviewReportPage /> },
      { path: "reports/revenue", element: <AdminRevenueReportPage /> },
      { path: "reports/occupancy", element: <AdminOccupancyReportPage /> },
      {
        path: "reports/branch-comparison",
        element: <AdminBranchComparisonReportPage />,
      },
      
      // Profile
      { path: "profile", element: <UserProfilePage /> },
    ],
  },

  // ==================== 404 PAGE ====================
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
