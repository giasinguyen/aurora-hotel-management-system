package com.aurora.backend.service.impl;

import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Payment;
import com.aurora.backend.repository.*;
import com.aurora.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Override
    public BigDecimal getTotalRevenue(LocalDate dateFrom, LocalDate dateTo, Long branchId) {
        // Giả sử Payment có trường paidAt và branchId thông qua booking
        return paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() != null && p.getStatus().equals("SUCCESS"))
                .filter(p -> p.getBooking() != null
                        && !p.getBooking().getCheckin().isBefore(dateFrom)
                        && !p.getBooking().getCheckout().isAfter(dateTo))
                .filter(p -> branchId == null ||
                        (p.getBooking().getBranch() != null &&
                                p.getBooking().getBranch().getId().equals(branchId.toString())))
                .map(Payment::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public long getTotalBookings(LocalDate dateFrom, LocalDate dateTo, String status, Long branchId) {
        return bookingRepository.findAll().stream()
                .filter(b -> !b.getCheckin().isBefore(dateFrom) && !b.getCheckout().isAfter(dateTo))
                .filter(b -> status == null || b.getStatus().name().equalsIgnoreCase(status))
                .filter(b -> branchId == null || b.getBranch().getId().equals(branchId.toString()))
                .count();
    }

    @Override
    public double getOccupancyRate(LocalDate date, Long branchId) {
        List<?> allRooms = roomRepository.findByBranchId(branchId.toString());
        long totalRooms = allRooms.size();
        if (totalRooms == 0) return 0;

        // Đếm số phòng đang có booking tại thời điểm đó
        long bookedRooms = bookingRepository.findAll().stream()
                .filter(b -> b.getBranch().getId().equals(branchId.toString()))
                .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED
                        || b.getStatus() == Booking.BookingStatus.CHECKED_IN)
                .filter(b -> !b.getCheckin().isAfter(date) && !b.getCheckout().isBefore(date))
                .flatMap(b -> b.getRooms().stream())
                .map(br -> br.getRoom().getId())
                .distinct()
                .count();

        return (double) bookedRooms / totalRooms * 100;
    }

    @Override
    public BigDecimal getAverageBookingValue(LocalDate dateFrom, LocalDate dateTo) {
        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> !b.getCheckin().isBefore(dateFrom) && !b.getCheckout().isAfter(dateTo))
                .collect(Collectors.toList());

        if (bookings.isEmpty()) return BigDecimal.ZERO;

        BigDecimal total = bookings.stream()
                .map(Booking::getTotalPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return total.divide(BigDecimal.valueOf(bookings.size()), BigDecimal.ROUND_HALF_UP);
    }

    @Override
    public List<Map<String, Object>> getTopSellingRoomTypes(int limit, Long branchId) {
        Map<String, Long> roomTypeCount = bookingRepository.findAll().stream()
                .filter(b -> branchId == null || b.getBranch().getId().equals(branchId.toString()))
                .flatMap(b -> b.getRooms().stream())
                .collect(Collectors.groupingBy(
                        br -> br.getRoom().getRoomType().getName(),
                        Collectors.counting()
                ));

        return roomTypeCount.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("roomType", e.getKey());
                    map.put("bookings", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Long> getCustomerGrowth(String period) {
        Map<String, Long> result = new LinkedHashMap<>();

        List<com.aurora.backend.entity.User> users = userRepository.findAll();

        if ("MONTH".equalsIgnoreCase(period)) {
            users.stream()
                    .collect(Collectors.groupingBy(
                            u -> YearMonth.from(u.getCreatedAt()).toString(),
                            TreeMap::new,
                            Collectors.counting()
                    ))
                    .forEach(result::put);
        } else if ("YEAR".equalsIgnoreCase(period)) {
            users.stream()
                    .collect(Collectors.groupingBy(
                            u -> String.valueOf(u.getCreatedAt().getYear()),
                            TreeMap::new,
                            Collectors.counting()
                    ))
                    .forEach(result::put);
        }

        return result;
    }

    @Override
    public Map<String, BigDecimal> getRevenueByPaymentMethod(LocalDate dateFrom, LocalDate dateTo) {
        return paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.SUCCESS)
                .filter(p -> {
                    LocalDate checkin = p.getBooking().getCheckin();
                    LocalDate checkout = p.getBooking().getCheckout();
                    return checkin != null && checkout != null
                            && !checkin.isBefore(dateFrom)
                            && !checkout.isAfter(dateTo);
                })
                .collect(Collectors.groupingBy(
                        p -> p.getMethod().name().toLowerCase().replace("_", " "),

                        Collectors.reducing(BigDecimal.ZERO, Payment::getAmount, BigDecimal::add)
                ));
    }


    @Override
    public Map<String, Long> getBookingsBySource(LocalDate dateFrom, LocalDate dateTo) {
        // Giả sử trong Booking có trường "source" (e.g. "Website", "Walk-in", "App")
        return bookingRepository.findAll().stream()
                .filter(b -> !b.getCheckin().isBefore(dateFrom) && !b.getCheckout().isAfter(dateTo))
                .collect(Collectors.groupingBy(
                        b -> Optional.ofNullable(b.getCreatedBy()).orElse("Unknown"),
                        Collectors.counting()
                ));
    }
}
