package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.VnPayPaymentRequest;
import com.aurora.backend.dto.response.VnPayPaymentResponse;
import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Payment;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.repository.BookingRepository;
import com.aurora.backend.repository.PaymentRepository;
import com.aurora.backend.service.EmailService;
import com.aurora.backend.service.VnPayService;
import com.aurora.backend.util.VnPayUtil;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class VnPayServiceImpl implements VnPayService {
    
    @Value("${vnpay.tmn-code}")
    String tmnCode;
    
    @Value("${vnpay.hash-secret}")
    String hashSecret;
    
    @Value("${vnpay.pay-url}")
    String payUrl;
    
    @Value("${vnpay.return-url}")
    String returnUrl;
    
    @Value("${vnpay.ipn-url}")
    String ipnUrl;
    
    final BookingRepository bookingRepository;
    final PaymentRepository paymentRepository;
    final EmailService emailService;
    
    @Override
    public VnPayPaymentResponse createPaymentUrl(
            String bookingId, 
            String clientIp, 
            VnPayPaymentRequest request) {
        
        log.info("Creating VNPay payment URL for booking: {}", bookingId);
        
        // 1. Validate booking
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        // 2. Validate booking status (must be CONFIRMED)
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new AppException(ErrorCode.BOOKING_NOT_CONFIRMED);
        }
        
        // 3. Check if payment already exists and is pending
        Optional<Payment> existingPayment = paymentRepository
            .findByBookingAndStatus(booking, Payment.PaymentStatus.PENDING)
            .stream()
            .findFirst();
        
        Payment payment;
        if (existingPayment.isPresent()) {
            payment = existingPayment.get();
            log.info("Using existing pending payment: {}", payment.getId());
        } else {
            // Create new payment record
            payment = Payment.builder()
                .booking(booking)
                .method(Payment.PaymentMethod.VNPAY)
                .status(Payment.PaymentStatus.PENDING)
                .amount(booking.getTotalPrice())
                .currency("VND")
                .vnpayTxnRef(generateTxnRef(booking))
                .build();
            payment = paymentRepository.save(payment);
            log.info("Created new payment: {}", payment.getId());
        }
        
        // 4. Build VNPay parameters
        long amountInCents = payment.getAmount()
            .multiply(new BigDecimal("100"))
            .longValue();
        
        Date now = new Date();
        Date expireTime = new Date(now.getTime() + 15 * 60 * 1000); // +15 minutes
        
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", tmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(amountInCents));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", payment.getVnpayTxnRef());
        vnpParams.put("vnp_OrderInfo", "Thanh toan booking " + booking.getBookingCode() + " - Aurora Hotel");
        vnpParams.put("vnp_OrderType", "hotel");
        vnpParams.put("vnp_Locale", request.getLanguage() != null ? request.getLanguage() : "vn");
        vnpParams.put("vnp_ReturnUrl", returnUrl);
        vnpParams.put("vnp_IpAddr", clientIp);
        vnpParams.put("vnp_CreateDate", VnPayUtil.formatDate(now));
        vnpParams.put("vnp_ExpireDate", VnPayUtil.formatDate(expireTime));
        
        // Optional bank code
        if (request.getBankCode() != null && !request.getBankCode().isBlank()) {
            vnpParams.put("vnp_BankCode", request.getBankCode());
        }
        
        // 5. Build query and sign
        String queryString = VnPayUtil.buildQuery(vnpParams);
        String secureHash = VnPayUtil.hmacSHA512(hashSecret, queryString);
        String paymentUrl = payUrl + "?" + queryString + "&vnp_SecureHash=" + secureHash;
        
        log.info("Generated VNPay payment URL for booking: {}", bookingId);
        log.debug("VNPay payment URL: {}", paymentUrl);
        log.debug("VNPay query params: {}", vnpParams);
        
        return VnPayPaymentResponse.builder()
            .paymentUrl(paymentUrl)
            .paymentId(payment.getId())
            .txnRef(payment.getVnpayTxnRef())
            .amount(payment.getAmount())
            .expireTime(expireTime.toInstant()
                .atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
                .toLocalDateTime())
            .bookingCode(booking.getBookingCode())
            .build();
    }
    
    @Override
    public boolean validateSignature(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null) {
            log.warn("No vnp_SecureHash in params");
            return false;
        }
        
        // Remove hash before validation
        Map<String, String> paramsForValidation = new HashMap<>(params);
        paramsForValidation.remove("vnp_SecureHash");
        paramsForValidation.remove("vnp_SecureHashType");
        
        String queryString = VnPayUtil.buildQuery(paramsForValidation);
        String calculatedHash = VnPayUtil.hmacSHA512(hashSecret, queryString);
        
        boolean isValid = calculatedHash.equalsIgnoreCase(receivedHash);
        if (!isValid) {
            log.error("Invalid VNPay signature. Expected: {}, Received: {}", 
                calculatedHash, receivedHash);
        }
        
        return isValid;
    }
    
    @Override
    @Transactional
    public Map<String, String> handleIpnCallback(Map<String, String> params) {
        log.info("Processing VNPay IPN callback for txnRef: {}", params.get("vnp_TxnRef"));
        
        // 1. Validate signature
        if (!validateSignature(params)) {
            log.error("Invalid VNPay signature in IPN");
            return Map.of(
                "RspCode", "97",
                "Message", "Invalid signature"
            );
        }
        
        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");
        String transactionStatus = params.get("vnp_TransactionStatus");
        long amountInCents = Long.parseLong(params.get("vnp_Amount"));
        BigDecimal amount = new BigDecimal(amountInCents).divide(new BigDecimal("100"));
        
        // 2. Find payment by txnRef
        Payment payment = paymentRepository.findByVnpayTxnRef(txnRef)
            .orElseThrow(() -> {
                log.error("Payment not found for txnRef: {}", txnRef);
                return new RuntimeException("Payment not found");
            });
        
        // 3. Idempotent check - Nếu đã xử lý rồi thì return OK
        if (payment.getStatus() != Payment.PaymentStatus.PENDING) {
            log.info("Payment already processed: {}. Current status: {}", 
                payment.getId(), payment.getStatus());
            return Map.of(
                "RspCode", "00",
                "Message", "Order already confirmed"
            );
        }
        
        // 4. Validate amount
        if (payment.getAmount().compareTo(amount) != 0) {
            log.error("Amount mismatch. Expected: {}, Received: {}", 
                payment.getAmount(), amount);
            return Map.of(
                "RspCode", "04",
                "Message", "Invalid Amount"
            );
        }
        
        // 5. Process payment based on response code
        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            // Success
            payment.setStatus(Payment.PaymentStatus.SUCCESS);
            payment.setPaidAt(LocalDateTime.now());
            payment.setProviderTxnId(transactionNo);
            payment.setVnpayResponseCode(responseCode);
            payment.setVnpayBankCode(params.get("vnp_BankCode"));
            payment.setVnpayCardType(params.get("vnp_CardType"));
            payment.setVnpaySecureHash(params.get("vnp_SecureHash"));
            payment.setProviderResponse(params.toString());
            
            // Update booking status to PAID
            Booking booking = payment.getBooking();
            booking.setPaymentStatus(Booking.PaymentStatus.PAID);
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            booking.setUpdatedAt(LocalDateTime.now());
            
            paymentRepository.save(payment);
            bookingRepository.save(booking);
            
            log.info("Payment SUCCESS for booking: {} ({})", 
                booking.getBookingCode(), booking.getId());
            
            // Send booking confirmation email asynchronously
            try {
                emailService.sendBookingConfirmation(booking);
                log.info("Booking confirmation email queued for: {}", booking.getBookingCode());
            } catch (Exception e) {
                log.error("Failed to send booking confirmation email for: {}", 
                    booking.getBookingCode(), e);
                // Don't fail the payment processing if email fails
            }
            
            return Map.of(
                "RspCode", "00",
                "Message", "Confirm Success"
            );
        } else {
            // Failed
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setVnpayResponseCode(responseCode);
            payment.setProviderResponse(params.toString());
            paymentRepository.save(payment);
            
            log.warn("Payment FAILED for txnRef: {}. Response code: {}", 
                txnRef, responseCode);
            
            return Map.of(
                "RspCode", "00",
                "Message", "Confirm Failed"
            );
        }
    }
    
    @Override
    @Transactional
    public Map<String, Object> handleReturnUrl(Map<String, String> params) {
        log.info("Processing VNPay Return URL for txnRef: {}", params.get("vnp_TxnRef"));
        
        boolean isValid = validateSignature(params);
        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionNo = params.get("vnp_TransactionNo");
        long amountInCents = Long.parseLong(params.getOrDefault("vnp_Amount", "0"));
        BigDecimal amount = new BigDecimal(amountInCents).divide(new BigDecimal("100"));
        
        // Find payment with booking eagerly loaded
        Payment payment = paymentRepository.findByVnpayTxnRef(txnRef).orElse(null);
        Booking booking = null;
        
        if (payment != null && payment.getBooking() != null) {
            // Force initialization of booking proxy within transaction
            booking = payment.getBooking();
            booking.getBookingCode(); // Trigger lazy load
            
            // Update payment status if successful and not already processed
            if ("00".equals(responseCode) && payment.getStatus() == Payment.PaymentStatus.PENDING) {
                log.info("=== VNPAY RETURN: Payment successful, updating payment and booking status");
                
                payment.setStatus(Payment.PaymentStatus.SUCCESS);
                payment.setPaidAt(LocalDateTime.now());
                payment.setProviderTxnId(transactionNo);
                payment.setVnpayResponseCode(responseCode);
                payment.setVnpayBankCode(params.get("vnp_BankCode"));
                payment.setVnpayCardType(params.get("vnp_CardType"));
                payment.setProviderResponse(params.toString());
                
                booking.setPaymentStatus(Booking.PaymentStatus.PAID);
                booking.setStatus(Booking.BookingStatus.CONFIRMED);
                booking.setUpdatedAt(LocalDateTime.now());
                
                paymentRepository.save(payment);
                bookingRepository.save(booking);
                
                log.info("=== VNPAY RETURN: Payment and booking updated successfully");
                
                // Send booking confirmation email
                try {
                    log.info("=== VNPAY RETURN: Sending confirmation email...");
                    emailService.sendBookingConfirmation(booking);
                    log.info("=== VNPAY RETURN: Email sent successfully");
                } catch (Exception e) {
                    log.error("=== VNPAY RETURN: Failed to send confirmation email", e);
                }
            } else if ("00".equals(responseCode)) {
                log.info("=== VNPAY RETURN: Payment already processed (status: {})", payment.getStatus());
            } else {
                log.warn("=== VNPAY RETURN: Payment failed with response code: {}", responseCode);
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("valid", isValid);
        result.put("success", "00".equals(responseCode));
        result.put("responseCode", responseCode);
        result.put("txnRef", txnRef);
        result.put("amount", amount);
        result.put("transactionNo", params.getOrDefault("vnp_TransactionNo", ""));
        result.put("bankCode", params.getOrDefault("vnp_BankCode", ""));
        result.put("cardType", params.getOrDefault("vnp_CardType", ""));
        result.put("paymentId", payment != null ? payment.getId() : "");
        result.put("bookingId", booking != null ? booking.getId() : "");
        result.put("bookingCode", booking != null ? booking.getBookingCode() : "");
        result.put("paymentStatus", payment != null ? payment.getStatus().name() : "");
        
        return result;
    }
    
    /**
     * Generate unique transaction reference for VNPay
     * Format: AURORA_YYYYMMDDHHMMSS_BOOKINGCODE
     */
    private String generateTxnRef(Booking booking) {
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        return "AURORA_" + timestamp + "_" + booking.getBookingCode();
    }
}
