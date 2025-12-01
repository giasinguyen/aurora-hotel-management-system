package com.aurora.backend.service;

import com.aurora.backend.dto.response.BranchComparisonResponse;
import com.aurora.backend.dto.response.CustomerGrowthPoint;
import com.aurora.backend.dto.response.DashboardOverviewResponse;
import com.aurora.backend.dto.response.OccupancyStatistics;
import com.aurora.backend.dto.response.RevenueStatistics;
import com.aurora.backend.dto.response.ShiftReportResponse;
import com.aurora.backend.dto.response.ShiftSummaryResponse;
import com.aurora.backend.dto.response.TopRoomTypeResponse;
import com.aurora.backend.enums.DashboardGroupBy;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface DashboardService {

    DashboardOverviewResponse getAdminOverview(LocalDate dateFrom, LocalDate dateTo);

    DashboardOverviewResponse getBranchOverview(String branchId, LocalDate dateFrom, LocalDate dateTo);

    DashboardOverviewResponse getStaffOverview(String username, LocalDate dateFrom, LocalDate dateTo);

    List<RevenueStatistics> getRevenueStatistics(LocalDate dateFrom,
                                                 LocalDate dateTo,
                                                 DashboardGroupBy groupBy,
                                                 String branchId);

    OccupancyStatistics getOccupancyStatistics(LocalDate date, String branchId);

    List<TopRoomTypeResponse> getTopSellingRoomTypes(int limit, String branchId);

    Map<String, java.math.BigDecimal> getRevenueByPaymentMethod(LocalDate dateFrom,
                                                                LocalDate dateTo,
                                                                String branchId);

    Map<String, Long> getBookingsBySource(LocalDate dateFrom, LocalDate dateTo, String branchId);

    List<CustomerGrowthPoint> getCustomerGrowth(DashboardGroupBy period);

    List<BranchComparisonResponse> getBranchComparison(LocalDate dateFrom, LocalDate dateTo);

    List<ShiftReportResponse> getShiftReport(LocalDate dateFrom, LocalDate dateTo, 
                                              String branchId, String staffId);

    ShiftSummaryResponse getShiftSummary(LocalDate dateFrom, LocalDate dateTo, String branchId);
}
