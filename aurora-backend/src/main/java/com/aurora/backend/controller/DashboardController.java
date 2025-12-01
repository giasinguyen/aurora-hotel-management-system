package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.config.annotation.RequirePermission.LogicType;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.BranchComparisonResponse;
import com.aurora.backend.dto.response.CustomerGrowthPoint;
import com.aurora.backend.dto.response.DashboardOverviewResponse;
import com.aurora.backend.dto.response.OccupancyStatistics;
import com.aurora.backend.dto.response.RevenueStatistics;
import com.aurora.backend.dto.response.ShiftReportResponse;
import com.aurora.backend.dto.response.ShiftSummaryResponse;
import com.aurora.backend.dto.response.TopRoomTypeResponse;
import com.aurora.backend.enums.DashboardGroupBy;
import com.aurora.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin/overview")
    @RequirePermission(PermissionConstants.Admin.DASHBOARD_VIEW_ADMIN)
    public ApiResponse<DashboardOverviewResponse> getAdminOverview(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo
    ) {
        DashboardOverviewResponse result = dashboardService.getAdminOverview(dateFrom, dateTo);
        return ApiResponse.<DashboardOverviewResponse>builder()
                .result(result)
                .build();
    }

    @GetMapping("/manager/branch/{branchId}")
    @RequirePermission(PermissionConstants.Manager.DASHBOARD_VIEW_MANAGER)
    public ApiResponse<DashboardOverviewResponse> getManagerBranchOverview(
            @PathVariable String branchId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo
    ) {
        DashboardOverviewResponse result = dashboardService.getBranchOverview(branchId, dateFrom, dateTo);
        return ApiResponse.<DashboardOverviewResponse>builder()
                .result(result)
                .build();
    }

    @GetMapping("/staff")
    @RequirePermission(PermissionConstants.Staff.DASHBOARD_VIEW_STAFF)
    public ApiResponse<DashboardOverviewResponse> getStaffDashboard(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        DashboardOverviewResponse result = dashboardService.getStaffOverview(username, dateFrom, dateTo);
        return ApiResponse.<DashboardOverviewResponse>builder()
                .result(result)
                .build();
    }

    @GetMapping("/revenue")
    @RequirePermission(value = {
            PermissionConstants.Admin.DASHBOARD_VIEW_ADMIN,
            PermissionConstants.Manager.DASHBOARD_VIEW_MANAGER
    }, logic = LogicType.OR)
    public ApiResponse<List<RevenueStatistics>> getRevenueStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(defaultValue = "DAY") String groupBy,
            @RequestParam(required = false) String branchId
    ) {
        DashboardGroupBy bucket = DashboardGroupBy.from(groupBy);
        List<RevenueStatistics> result = dashboardService.getRevenueStatistics(dateFrom, dateTo, bucket, branchId);
        return ApiResponse.<List<RevenueStatistics>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/occupancy")
    @RequirePermission(value = {
            PermissionConstants.Manager.DASHBOARD_VIEW_MANAGER,
            PermissionConstants.Staff.DASHBOARD_VIEW_STAFF
    }, logic = LogicType.OR)
    public ApiResponse<OccupancyStatistics> getOccupancy(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String branchId
    ) {
        OccupancyStatistics result = dashboardService.getOccupancyStatistics(date, branchId);
        return ApiResponse.<OccupancyStatistics>builder()
                .result(result)
                .build();
    }

    @GetMapping("/top-rooms")
    @RequirePermission(value = {
            PermissionConstants.Admin.DASHBOARD_VIEW_ADMIN,
            PermissionConstants.Manager.DASHBOARD_VIEW_MANAGER
    }, logic = LogicType.OR)
    public ApiResponse<List<TopRoomTypeResponse>> getTopRooms(
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String branchId
    ) {
        List<TopRoomTypeResponse> result = dashboardService.getTopSellingRoomTypes(limit, branchId);
        return ApiResponse.<List<TopRoomTypeResponse>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/revenue/payment-methods")
    @RequirePermission(value = {
            PermissionConstants.Admin.DASHBOARD_VIEW_ADMIN,
            PermissionConstants.Manager.DASHBOARD_VIEW_MANAGER
    }, logic = LogicType.OR)
    public ApiResponse<Map<String, java.math.BigDecimal>> getRevenueByMethod(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String branchId
    ) {
        Map<String, java.math.BigDecimal> result =
                dashboardService.getRevenueByPaymentMethod(dateFrom, dateTo, branchId);
        return ApiResponse.<Map<String, java.math.BigDecimal>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/bookings/source")
    @RequirePermission(value = {
            PermissionConstants.Admin.DASHBOARD_VIEW_ADMIN,
            PermissionConstants.Manager.DASHBOARD_VIEW_MANAGER
    }, logic = LogicType.OR)
    public ApiResponse<Map<String, Long>> getBookingsBySource(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String branchId
    ) {
        Map<String, Long> result = dashboardService.getBookingsBySource(dateFrom, dateTo, branchId);
        return ApiResponse.<Map<String, Long>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/customer-growth")
    @RequirePermission(PermissionConstants.Admin.DASHBOARD_VIEW_ADMIN)
    public ApiResponse<List<CustomerGrowthPoint>> getCustomerGrowth(
            @RequestParam(defaultValue = "MONTH") String period
    ) {
        DashboardGroupBy bucket = DashboardGroupBy.from(period);
        List<CustomerGrowthPoint> result = dashboardService.getCustomerGrowth(bucket);
        return ApiResponse.<List<CustomerGrowthPoint>>builder()
                .result(result)
                .build();
    }

    // =====================
    // Branch Comparison Reports
    // =====================

    @GetMapping("/branch-comparison")
    @RequirePermission(PermissionConstants.Admin.DASHBOARD_VIEW_ADMIN)
    public ApiResponse<List<BranchComparisonResponse>> getBranchComparison(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo
    ) {
        List<BranchComparisonResponse> result = dashboardService.getBranchComparison(dateFrom, dateTo);
        return ApiResponse.<List<BranchComparisonResponse>>builder()
                .result(result)
                .build();
    }

    // =====================
    // Shift Reports
    // =====================

    @GetMapping("/shift-report")
    @RequirePermission(value = {
            PermissionConstants.Admin.DASHBOARD_VIEW_ADMIN,
            PermissionConstants.Manager.DASHBOARD_VIEW_MANAGER,
            PermissionConstants.Staff.DASHBOARD_VIEW_STAFF
    }, logic = LogicType.OR)
    public ApiResponse<List<ShiftReportResponse>> getShiftReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String branchId,
            @RequestParam(required = false) String staffId
    ) {
        List<ShiftReportResponse> result = dashboardService.getShiftReport(dateFrom, dateTo, branchId, staffId);
        return ApiResponse.<List<ShiftReportResponse>>builder()
                .result(result)
                .build();
    }

    @GetMapping("/shift-summary")
    @RequirePermission(value = {
            PermissionConstants.Admin.DASHBOARD_VIEW_ADMIN,
            PermissionConstants.Manager.DASHBOARD_VIEW_MANAGER
    }, logic = LogicType.OR)
    public ApiResponse<ShiftSummaryResponse> getShiftSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String branchId
    ) {
        ShiftSummaryResponse result = dashboardService.getShiftSummary(dateFrom, dateTo, branchId);
        return ApiResponse.<ShiftSummaryResponse>builder()
                .result(result)
                .build();
    }
}