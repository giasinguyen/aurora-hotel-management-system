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
import BookingUpdatePage from "@/pages/bookings/BookingUpdate";

// Branches
import AssignBranchPage from "@/pages/branches/AssignBranch";
import BranchListPage from "@/pages/branches/BranchList";
import BranchUpsertPage from "@/pages/branches/BranchUpsert";

// Common
import ContactPage from "@/pages/landing/Contact";
import ErrorPage from "@/pages/common/ErrorPage";
import GalleryPage from "@/pages/landing/Gallery";
import HomePage from "@/pages/landing/Home";
import NewsPage from "@/pages/landing/News";
import NewsDetailPage from "@/pages/landing/NewsDetail";
import ServicePage from "@/pages/landing/Service";
import UserProfilePage from "@/pages/common/customer/UserProfile";
import GuestBranchListPage from "@/pages/landing/BranchList";
import AboutPage from "@/pages/landing/About";
import AccommodationPage from "@/pages/landing/Accommodation";
import AccommodationCategoryPage from "@/pages/landing/AccommodationCategory";
import BookingPage from "@/pages/landing/Booking";
import CheckoutPage from "@/pages/landing/checkout";
import BookingSuccessPage from "@/pages/landing/checkout/BookingSuccess";
import UserBookingDetailPage from "@/pages/common/customer/UserBookingDetail";
import PaymentReturnPage from "@/pages/landing/payment/PaymentReturn";
// Common - Customer Area
import ProfilePage from "@/pages/common/customer/account/Profile";
import ProfileUpsertPage from "@/pages/common/customer/account/ProfileUpsert";
import CustomerBookingListPage from "@/pages/common/customer/bookings/BookingList";
import FavoriteListPage from "@/pages/common/customer/favorites/FavoriteList";
import PaymentPage from "@/pages/common/customer/payment/PaymentPage";
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
import NewsPreview from "@/pages/news/NewsPreview";

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
import RoomEventListPage from "@/pages/rooms/RoomEventList";
import RoomEventUpsertPage from "@/pages/rooms/RoomEventUpsert";

// Services
import ServiceListPage from "@/pages/services/ServiceList";
import ServiceUpsertPage from "@/pages/services/ServiceUpsert";
import ServiceCategoryListPage from "@/pages/services/ServiceCategoryList";
import ServiceCategoryUpsertPage from "@/pages/services/ServiceCategoryUpsert";

// Shifts
import ShiftManagementPage from "@/pages/shifts/ShiftManagement";
import StaffShiftDashboard from "@/pages/shifts/StaffShiftDashboard";

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
      { index: true, element: <HomePage /> }, // temp complete
      { path: "auth", element: <AuthPage /> }, // temp complete
      { path: "about", element: <AboutPage /> }, // temp complete
      { path: "accommodation", element: <AccommodationPage /> }, // temp complete
      { path: "accommodation/:categoryId", element: <AccommodationCategoryPage />, }, // temp complete
      { path: "booking", element: <BookingPage /> }, // temp complete
      { path: "booking/checkout", element: <CheckoutPage /> },
      { path: "booking/success", element: <BookingSuccessPage /> },
      { path: "booking/user-booking-detail/:id", element: <UserBookingDetailPage />, },
      { path: "service", element: <ServicePage /> }, // temp complete
      { path: "branches", element: <GuestBranchListPage /> }, //TODO: Giới thiệu chi nhánh => update later
      { path: "gallery", element: <GalleryPage /> }, //TODO: Giới thiệu album => update later
      { path: "news", element: <NewsPage /> }, //TODO: Giới thiệu news website (Trung Nguyen) => update later
      { path: "news/:slug", element: <NewsDetailPage /> }, //TODO: Giới thiệu news website (Trung Nguyen) => update later
      { path: "contact", element: <ContactPage /> }, //TODO: Giới thiệu Liên hệ => update later
      { path: "payment", element: <PaymentPage /> }, //TODO: Fix URL => thanh toán sau booking (Gia Sĩ) => update later
      { path: "payment/return", element: <PaymentReturnPage /> }, //TODO: Fix URL => thanh toán sau booking (Gia Sĩ) => update later
      // Customer
      { path: "profile", element: <ProfilePage /> }, //TODO: refactor layout! => fix
      { path: "profile/upsert", element: <ProfileUpsertPage /> }, //TODO: no API call => fix
      { path: "my-bookings", element: <CustomerBookingListPage /> }, // cleanup => update later
      { path: "booking/:id", element: <BookingDetailPage /> }, // Customer booking detail
      { path: "favorites", element: <FavoriteListPage /> }, //TODO: => update later
      { path: "reviews", element: <ReviewListPage /> }, //TODO => fix URL => matching booking!
      { path: "reviews/upsert", element: <ReviewUpsertPage /> }, //TODO => fix URL => matching booking!
    ],
  },
  {
    path: "/staff",
    element: <StaffPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <StaffDashboardPage /> },
      { path: "bookings", element: <BookingListPage /> },
      { path: "bookings/:id/update", element: <BookingUpdatePage /> },
      { path: "bookings/:id", element: <BookingDetailPage /> },
      { path: "booking", element: <BookingPage /> },
      { path: "booking/checkout", element: <CheckoutPage /> },
      { path: "users/upsert", element: <UserUpsertPage /> },
      { path: "reports/shift", element: <ShiftReportPage /> },
      { path: "shifts", element: <StaffShiftDashboard /> },
      { path: "my-shift", element: <StaffShiftDashboard /> },
      { path: "profile", element: <UserProfilePage /> },
    ],
  },
  {
    path: "/manager",
    element: <ManagerPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ManagerDashboardPage /> },
      { path: "bookings", element: <BookingListPage /> },
      { path: "bookings/:id/update", element: <BookingUpdatePage /> },
      { path: "bookings/:id", element: <BookingDetailPage /> },
      { path: "booking", element: <BookingPage /> },
      { path: "booking/checkout", element: <CheckoutPage /> },
      { path: "reports/shift", element: <ShiftReportPage /> },
      { path: "shifts", element: <ShiftManagementPage /> },
      { path: "rooms", element: <RoomListPage /> },
      { path: "rooms/upsert", element: <RoomUpsertPage /> },
      { path: "room-types", element: <RoomTypeListPage /> },
      { path: "room-types/upsert", element: <RoomTypeUpsertPage /> },
      { path: "room-events", element: <RoomEventListPage /> },
      { path: "room-events/upsert", element: <RoomEventUpsertPage /> },
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
      { path: "news/upsert/:slug", element: <NewsUpsertPage /> },
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
      { path: "bookings", element: <BookingListPage /> },
      { path: "bookings/:id/update", element: <BookingUpdatePage /> },
      { path: "bookings/:id", element: <BookingDetailPage /> },
      { path: "booking", element: <BookingPage /> },
      { path: "booking/checkout", element: <CheckoutPage /> },
      { path: "reports/shift", element: <ShiftReportPage /> },
      { path: "rooms", element: <RoomListPage /> },
      { path: "rooms/upsert", element: <RoomUpsertPage /> },
      { path: "room-types", element: <RoomTypeListPage /> },
      { path: "room-types/upsert", element: <RoomTypeUpsertPage /> },
      { path: "room-categories", element: <RoomCategoryListPage /> },
      { path: "room-categories/upsert", element: <RoomCategoryUpsertPage /> },
      { path: "room-events", element: <RoomEventListPage /> },
      { path: "room-events/upsert", element: <RoomEventUpsertPage /> },
      { path: "service-categories", element: <ServiceCategoryListPage /> },
      {
        path: "service-categories/upsert",
        element: <ServiceCategoryUpsertPage />,
      },
      { path: "services", element: <ServiceListPage /> },
      { path: "services/upsert", element: <ServiceUpsertPage /> },
      { path: "promotions", element: <PromotionListPage /> },
      { path: "promotions/upsert", element: <PromotionUpsertPage /> },
      { path: "news", element: <NewsListPage /> },
      { path: "news/upsert", element: <NewsUpsertPage /> },
      { path: "news/upsert/:slug", element: <NewsUpsertPage /> },
      { path: "news/preview/:slug", element: <NewsPreview /> },
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
      {
        path: "reports/branch-comparison",
        element: <BranchComparisonReportPage />,
      },
      { path: "profile", element: <UserProfilePage /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
