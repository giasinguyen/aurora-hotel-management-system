package com.aurora.backend.controller;

import com.aurora.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/revenue")
    public BigDecimal getTotalRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) Long branchId
    ) {
        return dashboardService.getTotalRevenue(dateFrom, dateTo, branchId);
    }

    @GetMapping("/bookings")
    public long getTotalBookings(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long branchId
    ) {
        return dashboardService.getTotalBookings(dateFrom, dateTo, status, branchId);
    }

    @GetMapping("/revenue-by-method")
    public Map<String, BigDecimal> getRevenueByPaymentMethod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo
    ) {
        return dashboardService.getRevenueByPaymentMethod(dateFrom, dateTo);
    }

    @GetMapping("/top-room-types")
    public List<Map<String, Object>> getTopSellingRoomTypes(
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) Long branchId
    ) {
        return dashboardService.getTopSellingRoomTypes(limit, branchId);
    }
}
