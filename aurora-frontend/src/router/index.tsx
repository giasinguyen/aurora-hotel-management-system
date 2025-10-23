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

// Customer requests
import LateCheckoutRequestListPage from "@/pages/client/customer/requests/LateCheckoutRequestList";
import LateCheckoutRequestUpsertPage from "@/pages/client/customer/requests/LateCheckoutRequestUpsert";
import EarlyCheckinRequestListPage from "@/pages/client/customer/requests/EarlyCheckinRequestList";
import EarlyCheckinRequestUpsertPage from "@/pages/client/customer/requests/EarlyCheckinRequestUpsert";
import IssueReportListPage from "@/pages/client/customer/requests/IssueReportList";
import IssueReportUpsertPage from "@/pages/client/customer/requests/IssueReportUpsert";

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
import StaffCustomerRequestListPage from "@/pages/staff/requests/CustomerRequestList";
import StaffLateCheckoutRequestListPage from "@/pages/staff/requests/LateCheckoutRequestList";
import StaffEarlyCheckinRequestListPage from "@/pages/staff/requests/EarlyCheckinRequestList";
import StaffIssueReportListPage from "@/pages/staff/requests/IssueReportList";
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
import CheckInOutPage from "@/pages/commons/CheckInOut";
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
      {
        path: "customer/late-checkout-requests",
        element: <LateCheckoutRequestListPage />,
      },
      {
        path: "customer/late-checkout-requests/upsert",
        element: <LateCheckoutRequestUpsertPage />,
      },
      {
        path: "customer/early-checkin-requests",
        element: <EarlyCheckinRequestListPage />,
      },
      {
        path: "customer/early-checkin-requests/upsert",
        element: <EarlyCheckinRequestUpsertPage />,
      },
      { path: "customer/issue-reports", element: <IssueReportListPage /> },
      {
        path: "customer/issue-reports/upsert",
        element: <IssueReportUpsertPage />,
      },
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
      { path: "booking", element: <StaffBookingListPage /> },
      { path: "booking/upsert", element: <StaffBookingUpsertPage /> },
      { path: "booking/:id", element: <StaffBookingDetailPage /> },
      { path: "checkinout", element: <CheckInOutPage /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "customers/upsert", element: <StaffCustomerUpsertPage /> },
      { path: "customer-requests", element: <StaffCustomerRequestListPage /> },
      {
        path: "customer-requests/late-checkout",
        element: <StaffLateCheckoutRequestListPage />,
      },
      {
        path: "customer-requests/early-checkin",
        element: <StaffEarlyCheckinRequestListPage />,
      },
      {
        path: "customer-requests/issue-reports",
        element: <StaffIssueReportListPage />,
      },
      { path: "reports/shift", element: <ShiftReportPage /> },
    ],
  },

  // ==================== MANAGER ROUTES ====================
  {
    path: "/manager",
    element: <ManagerPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ManagerDashboardPage /> },
      { path: "rooms", element: <ManagerRoomListPage /> },
      { path: "rooms/upsert", element: <ManagerRoomUpsertPage /> },
      { path: "room-types", element: <RoomTypeListPage /> },
      { path: "room-types/upsert", element: <RoomTypeUpsertPage /> },
      { path: "services", element: <ManagerServiceListPage /> },
      { path: "services/upsert", element: <ManagerServiceUpsertPage /> },
      { path: "customers", element: <ManagerCustomerListPage /> },
      { path: "customers/upsert", element: <ManagerCustomerUpsertPage /> },
      { path: "customers/:id", element: <ManagerCustomerDetailPage /> },
      { path: "staff", element: <ManagerStaffListPage /> },
      { path: "staff/upsert", element: <ManagerStaffUpsertPage /> },
      { path: "staff/:id/assign-branch", element: <AssignBranchPage /> },
      { path: "promotions", element: <ManagerPromotionListPage /> },
      { path: "promotions/upsert", element: <ManagerPromotionUpsertPage /> },
      { path: "news", element: <ManagerNewsListPage /> },
      { path: "news/upsert", element: <ManagerNewsUpsertPage /> },
      { path: "reports/revenue", element: <ManagerRevenueReportPage /> },
      { path: "reports/occupancy", element: <ManagerOccupancyReportPage /> },
      { path: "checkinout", element: <CheckInOutPage /> },
      { path: "profile", element: <UserProfilePage /> },
    ],
  },

  // ==================== ADMIN ROUTES ====================
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "branches", element: <AdminBranchListPage /> },
      { path: "branches/upsert", element: <AdminBranchUpsertPage /> },
      { path: "users", element: <AdminUserListPage /> },
      { path: "users/upsert", element: <AdminUserUpsertPage /> },
      { path: "roles", element: <AdminRoleManagementPage /> },
      { path: "documents", element: <AdminDocumentListPage /> },
      { path: "documents/upsert", element: <AdminDocumentUpsertPage /> },
      { path: "reports/overview", element: <AdminOverviewReportPage /> },
      { path: "reports/revenue", element: <AdminRevenueReportPage /> },
      { path: "reports/occupancy", element: <AdminOccupancyReportPage /> },
      {
        path: "reports/branch-comparison",
        element: <AdminBranchComparisonReportPage />,
      },
      { path: "checkinout", element: <CheckInOutPage /> },
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
