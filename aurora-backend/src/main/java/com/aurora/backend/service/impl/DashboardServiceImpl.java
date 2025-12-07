    package com.aurora.backend.service.impl;

    import com.aurora.backend.dto.response.BranchComparisonResponse;
    import com.aurora.backend.dto.response.CustomerGrowthPoint;
    import com.aurora.backend.dto.response.DashboardOverviewResponse;
    import com.aurora.backend.dto.response.OccupancyStatistics;
    import com.aurora.backend.dto.response.RevenueStatistics;
    import com.aurora.backend.dto.response.ShiftReportResponse;
    import com.aurora.backend.dto.response.ShiftSummaryResponse;
    import com.aurora.backend.dto.response.TopRoomTypeResponse;
    import com.aurora.backend.entity.Booking;
    import com.aurora.backend.entity.Branch;
    import com.aurora.backend.entity.Payment;
    import com.aurora.backend.entity.StaffShiftAssignment;
    import com.aurora.backend.entity.ShiftCheckIn;
    import com.aurora.backend.enums.DashboardGroupBy;
    import com.aurora.backend.enums.ErrorCode;
    import com.aurora.backend.exception.AppException;
    import com.aurora.backend.repository.BookingRepository;
    import com.aurora.backend.repository.BookingRoomRepository;
    import com.aurora.backend.repository.BranchRepository;
    import com.aurora.backend.repository.PaymentRepository;
    import com.aurora.backend.repository.RoomRepository;
    import com.aurora.backend.repository.UserRepository;
    import com.aurora.backend.repository.StaffShiftAssignmentRepository;
    import com.aurora.backend.repository.ShiftCheckInRepository;
    import com.aurora.backend.repository.projection.PaymentMethodRevenueProjection;
    import com.aurora.backend.repository.projection.TopRoomTypeProjection;
    import com.aurora.backend.service.DashboardService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.data.domain.PageRequest;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import java.math.BigDecimal;
    import java.math.RoundingMode;
    import java.time.LocalDate;
    import java.time.temporal.ChronoUnit;
    import java.time.temporal.WeekFields;
    import java.util.ArrayList;
    import java.util.LinkedHashMap;
    import java.util.List;
    import java.util.Locale;
    import java.util.Map;
    import java.util.TreeMap;
    import java.util.UUID;
    import java.util.stream.Collectors;

    @Service
    @RequiredArgsConstructor
    @Transactional(readOnly = true)
    public class DashboardServiceImpl implements DashboardService {

        private static final int DEFAULT_RANGE_DAYS = 30;
        private static final int MAX_RANGE_DAYS = 366;
        private static final List<Booking.BookingStatus> OCCUPIED_STATUSES = List.of(
                Booking.BookingStatus.CONFIRMED,
                Booking.BookingStatus.CHECKED_IN
        );

        private final BookingRepository bookingRepository;
        private final PaymentRepository paymentRepository;
        private final RoomRepository roomRepository;
        private final BookingRoomRepository bookingRoomRepository;
        private final UserRepository userRepository;
        private final BranchRepository branchRepository;
        private final StaffShiftAssignmentRepository shiftAssignmentRepository;
        private final ShiftCheckInRepository shiftCheckInRepository;

        @Override
        public DashboardOverviewResponse getAdminOverview(LocalDate dateFrom, LocalDate dateTo) {
            DateRange range = normalizeRange(dateFrom, dateTo);
            return buildOverview(range, null);
        }

        @Override
        public DashboardOverviewResponse getBranchOverview(String branchId, LocalDate dateFrom, LocalDate dateTo) {
            String normalizedBranchId = normalizeBranchId(branchId);
            DateRange range = normalizeRange(dateFrom, dateTo);
            return buildOverview(range, normalizedBranchId);
        }

        @Override
        public DashboardOverviewResponse getStaffOverview(String username, LocalDate dateFrom, LocalDate dateTo) {
            var staff = userRepository.findByUsername(username)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            if (staff.getAssignedBranch() == null) {
                throw new AppException(ErrorCode.DASHBOARD_BRANCH_REQUIRED);
            }
            DateRange range = normalizeRange(dateFrom, dateTo);
            return buildOverview(range, staff.getAssignedBranch().getId());
        }

        @Override
        public List<RevenueStatistics> getRevenueStatistics(LocalDate dateFrom,
                                                            LocalDate dateTo,
                                                            DashboardGroupBy groupBy,
                                                            String branchId) {
            DashboardGroupBy bucket = groupBy == null ? DashboardGroupBy.DAY : groupBy;
            DateRange range = normalizeRange(dateFrom, dateTo);
            String normalizedBranchId = normalizeBranchId(branchId);
            List<Booking> bookings = bookingRepository.findAllWithinDateRange(range.start(), range.end(), normalizedBranchId);
            Map<LocalDate, RevenueAccumulator> aggregated = new TreeMap<>();

            for (Booking booking : bookings) {
                if (booking.getCheckin() == null) {
                    continue;
                }
                LocalDate bucketKey = bucket.normalize(booking.getCheckin());
                RevenueAccumulator accumulator = aggregated.computeIfAbsent(bucketKey, k -> new RevenueAccumulator());
                accumulator.addRevenue(booking.getTotalPrice());
                accumulator.increment();
            }

            return aggregated.entrySet().stream()
                    .map(entry -> RevenueStatistics.builder()
                            .periodLabel(formatPeriodLabel(bucket, entry.getKey()))
                            .revenue(entry.getValue().revenue())
                            .bookingCount(entry.getValue().count())
                            .averageBookingValue(entry.getValue().average())
                            .build())
                    .collect(Collectors.toList());
        }

        @Override
        public OccupancyStatistics getOccupancyStatistics(LocalDate date, String branchId) {
            LocalDate targetDate = date == null ? LocalDate.now() : date;
            String normalizedBranchId = normalizeBranchId(branchId);

            long totalRooms = roomRepository.countActiveRooms(normalizedBranchId);
            long occupiedRooms = totalRooms == 0 ? 0 :
                    bookingRoomRepository.countOccupiedRooms(normalizedBranchId, targetDate, OCCUPIED_STATUSES);
            long availableRooms = Math.max(totalRooms - occupiedRooms, 0);
            double occupancyRate = totalRooms == 0 ? 0d : (occupiedRooms * 100d) / totalRooms;

            return OccupancyStatistics.builder()
                    .date(targetDate)
                    .totalRooms(totalRooms)
                    .occupiedRooms(occupiedRooms)
                    .availableRooms(availableRooms)
                    .occupancyRate(occupancyRate)
                    .build();
        }

        @Override
        public List<TopRoomTypeResponse> getTopSellingRoomTypes(int limit, String branchId) {
            int resolvedLimit = limit > 0 ? limit : 5;
            String normalizedBranchId = normalizeBranchId(branchId);
            List<TopRoomTypeProjection> projections = bookingRoomRepository
                    .findTopRoomTypes(normalizedBranchId, PageRequest.of(0, resolvedLimit))
                    .getContent();

            return projections.stream()
                    .map(p -> TopRoomTypeResponse.builder()
                            .roomTypeId(p.getRoomTypeId())
                            .roomTypeName(p.getRoomTypeName())
                            .bookings(p.getBookingCount() == null ? 0L : p.getBookingCount())
                            .build())
                    .collect(Collectors.toList());
        }

        @Override
        public Map<String, BigDecimal> getRevenueByPaymentMethod(LocalDate dateFrom,
                                                                 LocalDate dateTo,
                                                                 String branchId) {
            DateRange range = normalizeRange(dateFrom, dateTo);
            String normalizedBranchId = normalizeBranchId(branchId);
            List<PaymentMethodRevenueProjection> data = paymentRepository.sumPaymentsByMethod(
                    Payment.PaymentStatus.SUCCESS,
                    range.start(),
                    range.end(),
                    normalizedBranchId
            );
            return data.stream()
                    .sorted((a, b) -> b.getTotalAmount().compareTo(a.getTotalAmount()))
                    .collect(Collectors.toMap(
                            projection -> projection.getMethod().name(),
                            PaymentMethodRevenueProjection::getTotalAmount,
                            (left, right) -> left,
                            LinkedHashMap::new
                    ));
        }

        @Override
        public Map<String, Long> getBookingsBySource(LocalDate dateFrom, LocalDate dateTo, String branchId) {
            DateRange range = normalizeRange(dateFrom, dateTo);
            String normalizedBranchId = normalizeBranchId(branchId);
            List<Object[]> raw = bookingRepository.countBookingsBySource(range.start(), range.end(), normalizedBranchId);
            return raw.stream()
                    .collect(Collectors.toMap(
                            row -> row[0] == null ? "UNKNOWN" : row[0].toString(),
                            row -> ((Number) row[1]).longValue(),
                            (left, right) -> left,
                            LinkedHashMap::new
                    ));
        }

        @Override
        public List<CustomerGrowthPoint> getCustomerGrowth(DashboardGroupBy period) {
            DashboardGroupBy bucket = period == null ? DashboardGroupBy.MONTH : period;

            String sqlFormat = switch (bucket) {
                case DAY -> "YYYY-MM-DD";
                case MONTH -> "YYYY-MM";
                case YEAR -> "YYYY";
                default -> "YYYY-MM";
            };

            List<Object[]> results = userRepository.countCustomersByPeriodNative(sqlFormat);

            return results.stream()
                    .map(row -> CustomerGrowthPoint.builder()
                            .periodLabel((String) row[0])
                            .customers(((Number) row[1]).longValue())
                            .build())
                    .collect(Collectors.toList());
        }

        // =====================
        // Branch Comparison Reports
        // =====================

        @Override
        public List<BranchComparisonResponse> getBranchComparison(LocalDate dateFrom, LocalDate dateTo) {
            DateRange range = normalizeRange(dateFrom, dateTo);
            List<Branch> activeBranches = branchRepository.findAllByStatus(Branch.BranchStatus.ACTIVE);
            
            List<BranchComparisonResponse> result = new ArrayList<>();
            
            for (Branch branch : activeBranches) {
                String branchId = branch.getId();
                
                // Calculate revenue for this branch
                BigDecimal totalRevenue = defaultZero(paymentRepository.sumPaymentsByStatusAndRange(
                        Payment.PaymentStatus.SUCCESS,
                        range.start(),
                        range.end(),
                        branchId
                ));
                
                // Calculate bookings count
                long totalBookings = bookingRepository.countBookingsWithinDateRange(
                        range.start(),
                        range.end(),
                        null,
                        branchId
                );
                
                // Calculate occupancy rate
                double occupancyRate = calculateOccupancyRate(LocalDate.now(), branchId);
                
                // Count rooms
                long roomCount = roomRepository.countActiveRooms(branchId);
                
                // Count staff (users assigned to this branch)
                long staffCount = userRepository.countByAssignedBranchId(branchId);
                
                result.add(BranchComparisonResponse.builder()
                        .branchId(branchId)
                        .branchCode(branch.getCode())
                        .branchName(branch.getName())
                        .city(branch.getCity())
                        .totalRevenue(totalRevenue)
                        .totalBookings(totalBookings)
                        .occupancyRate(Math.round(occupancyRate * 10.0) / 10.0)
                        .averageRating(4.5) // TODO: Implement rating system
                        .roomCount(roomCount)
                        .staffCount(staffCount)
                        .customerSatisfaction(90.0) // TODO: Implement satisfaction surveys
                        .build());
            }
            
            // Sort by revenue descending
            result.sort((a, b) -> b.getTotalRevenue().compareTo(a.getTotalRevenue()));
            
            return result;
        }

        @Override
        public List<ShiftReportResponse> getShiftReport(LocalDate dateFrom, LocalDate dateTo,
                                                         String branchId, String staffId) {
            DateRange range = normalizeRange(dateFrom, dateTo);
            String normalizedBranchId = normalizeBranchId(branchId);
            
            // Get all shift assignments in date range
            List<StaffShiftAssignment> assignments = shiftAssignmentRepository.findAllInRange(
                    range.start(), range.end(), normalizedBranchId, staffId);
            
            // Get all check-ins for these assignments
            List<String> assignmentIds = assignments.stream()
                    .map(StaffShiftAssignment::getId)
                    .collect(Collectors.toList());
            
            Map<String, ShiftCheckIn> checkInMap = new java.util.HashMap<>();
            if (!assignmentIds.isEmpty()) {
                List<ShiftCheckIn> checkIns = shiftCheckInRepository.findByAssignmentIdIn(assignmentIds);
                checkInMap = checkIns.stream()
                        .collect(Collectors.toMap(
                                ci -> ci.getAssignment().getId(),
                                ci -> ci,
                                (existing, replacement) -> existing
                        ));
            }
            
            // Build report responses
            List<ShiftReportResponse> shifts = new ArrayList<>();
            for (StaffShiftAssignment assignment : assignments) {
                ShiftCheckIn checkIn = checkInMap.get(assignment.getId());
                
                // Determine shift type based on start time
                String shiftType = determineShiftType(assignment.getWorkShift().getStartTime().toString());
                
                // Count check-ins/check-outs (1 if checked in/out, 0 otherwise)
                long checkIns = (checkIn != null && checkIn.getCheckInTime() != null) ? 1 : 0;
                long checkOuts = (checkIn != null && checkIn.getCheckOutTime() != null) ? 1 : 0;
                
                // For now, we don't have direct booking-to-shift tracking
                // So we'll report 0 for bookingsCreated and revenue
                // This can be enhanced later by tracking which staff created which bookings
                long bookingsCreated = 0;
                BigDecimal revenue = BigDecimal.ZERO;
                
                shifts.add(ShiftReportResponse.builder()
                        .shiftId(assignment.getId())
                        .staffId(assignment.getStaff().getId())
                        .staffName(assignment.getStaff().getFirstName() + " " + assignment.getStaff().getLastName())
                        .shiftDate(assignment.getShiftDate())
                        .shiftType(shiftType)
                        .startTime(assignment.getWorkShift().getStartTime().toString())
                        .endTime(assignment.getWorkShift().getEndTime().toString())
                        .checkIns(checkIns)
                        .checkOuts(checkOuts)
                        .bookingsCreated(bookingsCreated)
                        .revenue(revenue)
                        .build());
            }
            
            return shifts;
        }
        
        private String determineShiftType(String startTime) {
            if (startTime == null) return "MORNING";
            
            int hour = Integer.parseInt(startTime.split(":")[0]);
            
            if (hour >= 6 && hour < 14) {
                return "MORNING";
            } else if (hour >= 14 && hour < 22) {
                return "AFTERNOON";
            } else {
                return "NIGHT";
            }
        }

        @Override
        public ShiftSummaryResponse getShiftSummary(LocalDate dateFrom, LocalDate dateTo, String branchId) {
            List<ShiftReportResponse> shifts = getShiftReport(dateFrom, dateTo, branchId, null);
            
            long totalCheckIns = shifts.stream().mapToLong(ShiftReportResponse::getCheckIns).sum();
            long totalCheckOuts = shifts.stream().mapToLong(ShiftReportResponse::getCheckOuts).sum();
            BigDecimal totalRevenue = shifts.stream()
                    .map(ShiftReportResponse::getRevenue)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal averageRevenue = shifts.isEmpty() ? BigDecimal.ZERO :
                    totalRevenue.divide(BigDecimal.valueOf(shifts.size()), 2, RoundingMode.HALF_UP);
            
            return ShiftSummaryResponse.builder()
                    .totalShifts(shifts.size())
                    .totalCheckIns(totalCheckIns)
                    .totalCheckOuts(totalCheckOuts)
                    .totalRevenue(totalRevenue)
                    .averageShiftRevenue(averageRevenue)
                    .build();
        }

        private DashboardOverviewResponse buildOverview(DateRange range, String branchId) {
            BigDecimal totalRevenue = defaultZero(paymentRepository.sumPaymentsByStatusAndRange(
                    Payment.PaymentStatus.SUCCESS,
                    range.start(),
                    range.end(),
                    branchId
            ));

            long totalBookings = bookingRepository.countBookingsWithinDateRange(
                    range.start(),
                    range.end(),
                    null,
                    branchId
            );

            BigDecimal totalBookingValue = defaultZero(
                    bookingRepository.sumBookingTotalPrice(range.start(), range.end(), branchId)
            );

            BigDecimal averageBookingValue = totalBookings == 0
                    ? BigDecimal.ZERO
                    : totalBookingValue.divide(BigDecimal.valueOf(totalBookings), 2, RoundingMode.HALF_UP);

            LocalDate occupancyDate = range.end();
            LocalDate today = LocalDate.now();
            if (!range.start().isAfter(today) && !range.end().isBefore(today)) {
                occupancyDate = today; // Ưu tiên hiển thị tỉ lệ lấp đầy thực tế hiện tại
            }
            double occupancyRate = calculateOccupancyRate(occupancyDate, branchId);

            long newCustomers = bookingRepository.countFirstTimeCustomers(range.start(), range.end(), branchId);
            long returningCustomers = bookingRepository.countReturningCustomers(range.start(), range.end(), branchId);

            BigDecimal previousRevenue = defaultZero(paymentRepository.sumPaymentsByStatusAndRange(
                    Payment.PaymentStatus.SUCCESS,
                    range.previousStart(),
                    range.previousEnd(),
                    branchId
            ));

            double revenueGrowthPercent = calculateGrowthPercentage(totalRevenue, previousRevenue);

            return DashboardOverviewResponse.builder()
                    .totalRevenue(totalRevenue)
                    .totalBookings((int) totalBookings) // Cast về int cho khớp DTO
                    .averageBookingValue(averageBookingValue)
                    .occupancyRate(occupancyRate)
                    .newCustomers((int) newCustomers)
                    .returningCustomers((int) returningCustomers)
                    .revenueGrowthPercent(revenueGrowthPercent)
                    .build();
        }

        private double calculateOccupancyRate(LocalDate date, String branchId) {
            long totalRooms = roomRepository.countActiveRooms(branchId);
            if (totalRooms == 0) {
                return 0d;
            }
            long occupiedRooms = bookingRoomRepository.countOccupiedRooms(branchId, date, OCCUPIED_STATUSES);
            double rawRate = (occupiedRooms * 100d) / totalRooms;

            return Math.round(rawRate * 100.0) / 100.0;
        }

        private DateRange normalizeRange(LocalDate dateFrom, LocalDate dateTo) {
            LocalDate end = dateTo != null ? dateTo : LocalDate.now();
            LocalDate start = dateFrom != null ? dateFrom : end.minusDays(DEFAULT_RANGE_DAYS - 1L);
            if (start.isAfter(end)) {
                throw new AppException(ErrorCode.BOOKING_DATE_INVALID);
            }
            long days = ChronoUnit.DAYS.between(start, end) + 1;
            if (days > MAX_RANGE_DAYS) {
                throw new AppException(ErrorCode.DASHBOARD_DATE_RANGE_INVALID);
            }
            LocalDate previousEnd = start.minusDays(1);
            LocalDate previousStart = previousEnd.minusDays(days - 1);
            return new DateRange(start, end, previousStart, previousEnd);
        }

        private String formatPeriodLabel(DashboardGroupBy groupBy, LocalDate value) {
            return switch (groupBy) {
                case DAY -> value.toString();
                case WEEK -> {
                    int week = value.get(WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear());
                    yield value.getYear() + "-W" + String.format("%02d", week);
                }
                case MONTH -> value.getYear() + "-" + String.format("%02d", value.getMonthValue());
                case YEAR -> String.valueOf(value.getYear());
            };
        }

        private BigDecimal defaultZero(BigDecimal value) {
            return value == null ? BigDecimal.ZERO : value;
        }

        private double calculateGrowthPercentage(BigDecimal current, BigDecimal previous) {
            if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
                return current == null || current.compareTo(BigDecimal.ZERO) == 0 ? 0d : 100d;
            }
            return current.subtract(previous)
                    .divide(previous, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        private record DateRange(LocalDate start, LocalDate end, LocalDate previousStart, LocalDate previousEnd) {}

        private static final class RevenueAccumulator {
            private BigDecimal revenue = BigDecimal.ZERO;
            private long count;

            void addRevenue(BigDecimal amount) {
                if (amount != null) {
                    revenue = revenue.add(amount);
                }
            }

            void increment() {
                count++;
            }

            BigDecimal revenue() {
                return revenue;
            }

            long count() {
                return count;
            }

            BigDecimal average() {
                return count == 0 ? BigDecimal.ZERO :
                        revenue.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
            }
        }

        private String normalizeBranchId(String branchId) {
            if (branchId == null || branchId.isBlank()) {
                return null;
            }
            branchRepository.findById(branchId)
                    .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
            return branchId;
        }
    }
