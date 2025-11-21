package com.aurora.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface DashboardService {

    BigDecimal getTotalRevenue(LocalDate dateFrom, LocalDate dateTo, Long branchId);

    long getTotalBookings(LocalDate dateFrom, LocalDate dateTo, String status, Long branchId);

    double getOccupancyRate(LocalDate date, Long branchId);

    BigDecimal getAverageBookingValue(LocalDate dateFrom, LocalDate dateTo);

    List<Map<String, Object>> getTopSellingRoomTypes(int limit, Long branchId);

    Map<String, Long> getCustomerGrowth(String period);

    Map<String, BigDecimal> getRevenueByPaymentMethod(LocalDate dateFrom, LocalDate dateTo);

    Map<String, Long> getBookingsBySource(LocalDate dateFrom, LocalDate dateTo);
}
