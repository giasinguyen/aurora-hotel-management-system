package com.aurora.backend.scheduler;

import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Payment;
import com.aurora.backend.repository.BookingRepository;
import com.aurora.backend.repository.PaymentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduler tự động huỷ các booking VNPay ở trạng thái AWAITING_PAYMENT
 * sau 20 phút không thanh toán - giải phóng phòng cho khách khác đặt.
 */
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class VnPayBookingCleanupScheduler {

    BookingRepository bookingRepository;
    PaymentRepository paymentRepository;

    /**
     * Chạy mỗi phút, huỷ các booking AWAITING_PAYMENT tồn tại > 20 phút.
     * Link thanh toán VNPay hết hạn sau 15 phút nên 20 phút là đủ buffer.
     */
    @Scheduled(fixedDelay = 60_000) // every 60 seconds
    @Transactional
    public void cancelExpiredAwaitingPaymentBookings() {
        LocalDateTime expireThreshold = LocalDateTime.now().minusMinutes(20);

        List<Booking> expired = bookingRepository
                .findByStatusAndCreatedAtBefore(
                        Booking.BookingStatus.AWAITING_PAYMENT,
                        expireThreshold);

        if (expired.isEmpty()) {
            return;
        }

        log.info("Cancelling {} expired AWAITING_PAYMENT booking(s)", expired.size());

        for (Booking booking : expired) {
            // Cancel pending VNPay payment records
            List<Payment> pendingPayments = paymentRepository
                    .findByBookingAndStatus(booking, Payment.PaymentStatus.PENDING);
            for (Payment p : pendingPayments) {
                p.setStatus(Payment.PaymentStatus.FAILED);
                paymentRepository.save(p);
            }

            booking.setStatus(Booking.BookingStatus.CANCELLED);
            booking.setCancelledAt(LocalDateTime.now());
            booking.setCancellationReason("Tự động huỷ: hết thời gian chờ thanh toán VNPay (20 phút)");
            bookingRepository.save(booking);

            log.info("Auto-cancelled booking {} (AWAITING_PAYMENT expired)",
                    booking.getBookingCode());
        }
    }
}
