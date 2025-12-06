import { createBrowserRouter } from "react-router-dom";

// Layouts
import AdminPage from "@/layouts/admin";
import ClientPage from "@/layouts/client";
import ManagerPage from "@/layouts/manager";
import StaffPage from "@/layouts/staff";

// Auth
import AuthPage from "@/pages/auth";

// Bookings
import BookingDetailPage from "@/pages/bookings/BookingDetail";
import BookingListPage from "@/pages/bookings/BookingList";
import BookingUpsertPage from "@/pages/bookings/BookingUpsert";

// Branches
import AssignBranchPage from "@/pages/branches/AssignBranch";
import BranchListPage from "@/pages/branches/BranchList";
import BranchUpsertPage from "@/pages/branches/BranchUpsert";

// Common
import ContactPage from "@/pages/common/Contact";
import ErrorPage from "@/pages/common/ErrorPage";
import GalleryPage from "@/pages/common/Gallery";
import HomePage from "@/pages/common/Home";
import NewsPage from "@/pages/common/News";
import ServicePage from "@/pages/common/Service";
import UserProfilePage from "@/pages/common/UserProfile";
import GuestBranchListPage from "@/pages/common/BranchList";
import GuestRoomDetailPage from "@/pages/common/RoomDetail";
import GuestRoomListPage from "@/pages/common/RoomList";
import PaymentReturnPage from "@/pages/common/PaymentReturn";
import AboutPage from "@/pages/common/About";
import AccommodationPage from "@/pages/common/Accommodation";
import AccommodationCategoryPage from "@/pages/common/AccommodationCategory";
import BookingPage from "@/pages/common/Booking";
// Common - Customer Area
import ProfilePage from "@/pages/common/customer/account/Profile";
import ProfileUpsertPage from "@/pages/common/customer/account/ProfileUpsert";
import CreateBookingPage from "@/pages/common/customer/booking/CreateBooking";
import ConfirmBookingPage from "@/pages/common/customer/booking/ConfirmBooking";
import CustomerBookingListPage from "@/pages/common/customer/bookings/BookingList";
import CustomerBookingDetailPage from "@/pages/common/customer/bookings/BookingDetail";
import FavoriteListPage from "@/pages/common/customer/favorites/FavoriteList";
import PaymentPage from "@/pages/common/customer/payment/PaymentPage";
import LateCheckoutRequestListPage from "@/pages/common/customer/requests/LateCheckoutRequestList";
import LateCheckoutRequestUpsertPage from "@/pages/common/customer/requests/LateCheckoutRequestUpsert";
import EarlyCheckinRequestListPage from "@/pages/common/customer/requests/EarlyCheckinRequestList";
import EarlyCheckinRequestUpsertPage from "@/pages/common/customer/requests/EarlyCheckinRequestUpsert";
import IssueReportListPage from "@/pages/common/customer/requests/IssueReportList";
import IssueReportUpsertPage from "@/pages/common/customer/requests/IssueReportUpsert";
import ReviewListPage from "@/pages/common/customer/reviews/ReviewList";
import ReviewUpsertPage from "@/pages/common/customer/reviews/ReviewUpsert";

// Dashboard
import AdminDashboardPage from "@/pages/dashboard/AdminDashboard";
import ManagerDashboardPage from "@/pages/dashboard/ManagerDashboard";
import StaffDashboardPage from "@/pages/dashboard/StaffDashboard";

// Document
import DocumentListPage from "@/pages/document/DocumentList";
import DocumentUpsertPage from "@/pages/document/DocumentUpsert";

// News
import NewsListPage from "@/pages/news/NewsList";
import NewsUpsertPage from "@/pages/news/NewsUpsert";

// Promotion
import PromotionListPage from "@/pages/promotion/PromotionList";
import PromotionUpsertPage from "@/pages/promotion/PromotionUpsert";

// Reports
import BranchComparisonReportPage from "@/pages/reports/BranchComparisonReport";
import AdminOccupancyReportPage from "@/pages/reports/AdminOccupancyReport";
import AdminRevenueReportPage from "@/pages/reports/AdminRevenueReport";
import OccupancyReportPage from "@/pages/reports/OccupancyReport";
import OverviewReportPage from "@/pages/reports/OverviewReport";
import RevenueReportPage from "@/pages/reports/RevenueReport";
import ShiftReportPage from "@/pages/reports/ShiftReport";

// Role
import RoleManagementPage from "@/pages/role/RoleManagement";
import RoleDetailPage from "@/pages/role/RoleDetail";

// Rooms
import RoomListPage from "@/pages/rooms/RoomList";
import RoomCategoryListPage from "@/pages/rooms/RoomCategoryList";
import RoomCategoryUpsertPage from "@/pages/rooms/RoomCategoryUpsert";
import RoomTypeListPage from "@/pages/rooms/RoomTypeList";
import RoomTypeUpsertPage from "@/pages/rooms/RoomTypeUpsert";
import RoomUpsertPage from "@/pages/rooms/RoomUpsert";

// Services
import ServiceListPage from "@/pages/services/ServiceList";
import ServiceUpsertPage from "@/pages/services/ServiceUpsert";

// Shifts
import ShiftManagementPage from "@/pages/shifts/ShiftManagement";
import StaffCheckInPage from "@/pages/shifts/StaffCheckIn";

// User (shared)
import UserDetailPage from "@/pages/user/UserDetail";
import UserListPage from "@/pages/user/UserList";
import UserUpsertPage from "@/pages/user/UserUpsert";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientPage />,
    errorElement: <ErrorPage />,
    children: [
      // Guest
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "accommodation", element: <AccommodationPage /> },
      { path: "accommodation/:categoryId", element: <AccommodationCategoryPage /> },
      { path: "booking", element: <BookingPage /> },
      { path: "service", element: <ServicePage /> },
      { path: "branches", element: <GuestBranchListPage /> },
      { path: "rooms", element: <GuestRoomListPage /> },
      { path: "rooms/:id", element: <GuestRoomDetailPage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "news", element: <NewsPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "payment/return", element: <PaymentReturnPage /> },
      // Customer
      { path: "profile", element: <ProfilePage /> },
      { path: "profile/upsert", element: <ProfileUpsertPage /> },
      { path: "my-bookings", element: <CustomerBookingListPage /> },
      { path: "my-bookings/create", element: <CreateBookingPage /> },
      { path: "my-bookings/confirm", element: <ConfirmBookingPage /> },
      { path: "my-bookings/:id", element: <CustomerBookingDetailPage /> },
      { path: "favorites", element: <FavoriteListPage /> },
      { path: "late-checkout-requests", element: <LateCheckoutRequestListPage /> },
      { path: "late-checkout-requests/upsert", element: <LateCheckoutRequestUpsertPage /> },
      { path: "early-checkin-requests", element: <EarlyCheckinRequestListPage /> },
      { path: "early-checkin-requests/upsert", element: <EarlyCheckinRequestUpsertPage /> },
      { path: "issue-reports", element: <IssueReportListPage /> },
      { path: "issue-reports/upsert", element: <IssueReportUpsertPage /> },
      { path: "reviews", element: <ReviewListPage /> },
      { path: "reviews/upsert", element: <ReviewUpsertPage /> },
      { path: "payment", element: <PaymentPage /> },
    ],
  },
  {
    path: "/staff",
    element: <StaffPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <StaffDashboardPage /> },
      { path: "booking", element: <BookingListPage /> },
      { path: "booking/upsert", element: <BookingUpsertPage /> },
      { path: "booking/:id", element: <BookingDetailPage /> },
      { path: "users/upsert", element: <UserUpsertPage /> },
      { path: "reports/shift", element: <ShiftReportPage /> },
      { path: "shifts", element: <StaffCheckInPage /> },
      { path: "my-shift", element: <StaffCheckInPage /> },
      { path: "profile", element: <UserProfilePage /> },
    ],
  },
  {
    path: "/manager",
    element: <ManagerPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ManagerDashboardPage /> },
      { path: "booking", element: <BookingListPage /> },
      { path: "booking/upsert", element: <BookingUpsertPage /> },
      { path: "booking/:id", element: <BookingDetailPage /> },
      { path: "reports/shift", element: <ShiftReportPage /> },
      { path: "shifts", element: <ShiftManagementPage /> },
      { path: "rooms", element: <RoomListPage /> },
      { path: "rooms/upsert", element: <RoomUpsertPage /> },
      { path: "room-types", element: <RoomTypeListPage /> },
      { path: "room-types/upsert", element: <RoomTypeUpsertPage /> },
      { path: "services", element: <ServiceListPage /> },
      { path: "services/upsert", element: <ServiceUpsertPage /> },
      { path: "users", element: <UserListPage /> },
      { path: "users/upsert", element: <UserUpsertPage /> },
      { path: "users/detail", element: <UserDetailPage /> },
      { path: "users/:id/assign-branch", element: <AssignBranchPage /> },
      { path: "promotions", element: <PromotionListPage /> },
      { path: "promotions/upsert", element: <PromotionUpsertPage /> },
      { path: "news", element: <NewsListPage /> },
      { path: "news/upsert", element: <NewsUpsertPage /> },
      { path: "reports/revenue", element: <RevenueReportPage /> },
      { path: "reports/occupancy", element: <OccupancyReportPage /> },
      { path: "profile", element: <UserProfilePage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "booking", element: <BookingListPage /> },
      { path: "booking/upsert", element: <BookingUpsertPage /> },
      { path: "booking/:id", element: <BookingDetailPage /> },
      { path: "reports/shift", element: <ShiftReportPage /> },
      { path: "rooms", element: <RoomListPage /> },
      { path: "rooms/upsert", element: <RoomUpsertPage /> },
      { path: "room-types", element: <RoomTypeListPage /> },
      { path: "room-types/upsert", element: <RoomTypeUpsertPage /> },
      { path: "room-categories", element: <RoomCategoryListPage /> },
      { path: "room-categories/upsert", element: <RoomCategoryUpsertPage /> },
      { path: "services", element: <ServiceListPage /> },
      { path: "services/upsert", element: <ServiceUpsertPage /> },
      { path: "promotions", element: <PromotionListPage /> },
      { path: "promotions/upsert", element: <PromotionUpsertPage /> },
      { path: "news", element: <NewsListPage /> },
      { path: "news/upsert", element: <NewsUpsertPage /> },
      { path: "branches", element: <BranchListPage /> },
      { path: "branches/upsert", element: <BranchUpsertPage /> },
      { path: "users", element: <UserListPage /> },
      { path: "users/upsert", element: <UserUpsertPage /> },
      { path: "users/detail", element: <UserDetailPage /> },
      { path: "users/:id/assign-branch", element: <AssignBranchPage /> },
      { path: "roles", element: <RoleManagementPage /> },
      { path: "roles/:id", element: <RoleDetailPage /> },
      { path: "shifts", element: <ShiftManagementPage /> },
      { path: "documents", element: <DocumentListPage /> },
      { path: "documents/upsert", element: <DocumentUpsertPage /> },
      { path: "reports/overview", element: <OverviewReportPage /> },
      { path: "reports/revenue", element: <AdminRevenueReportPage /> },
      { path: "reports/occupancy", element: <AdminOccupancyReportPage /> },
      { path: "reports/branch-comparison", element: <BranchComparisonReportPage /> },
      { path: "profile", element: <UserProfilePage /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
