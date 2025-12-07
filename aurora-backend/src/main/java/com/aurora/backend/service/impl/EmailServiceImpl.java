package com.aurora.backend.service.impl;

import com.aurora.backend.config.MailjetConfig;
import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.BookingRoom;
import com.aurora.backend.service.EmailService;
import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.resource.Emailv31;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final MailjetClient mailjetClient;
    private final MailjetConfig mailjetConfig;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @Override
    public void sendBookingConfirmation(Booking booking) {
        try {
            log.info("=== EMAIL SERVICE: Starting email send for booking: {}", booking.getBookingCode());
            
            // Get customer email
            String customerEmail = booking.getCustomer() != null 
                ? booking.getCustomer().getEmail() 
                : booking.getGuestEmail();
            
            String customerName = booking.getCustomer() != null
                ? (booking.getCustomer().getFirstName() != null && booking.getCustomer().getLastName() != null 
                    ? booking.getCustomer().getFirstName() + " " + booking.getCustomer().getLastName()
                    : booking.getCustomer().getUsername())
                : booking.getGuestFullName();
            
            log.info("=== EMAIL SERVICE: Customer email: {}, Customer name: {}", customerEmail, customerName);
                
            if (customerEmail == null || customerEmail.isBlank()) {
                log.warn("=== EMAIL SERVICE: No email address found for booking: {}", booking.getBookingCode());
                return;
            }

            log.info("=== EMAIL SERVICE: Generating HTML content...");
            // Generate HTML content using Thymeleaf
            String htmlContent = generateBookingConfirmationHtml(booking);
            log.info("=== EMAIL SERVICE: HTML content generated, length: {}", htmlContent.length());
            
            // Load banner image and encode to base64
            log.info("=== EMAIL SERVICE: Loading banner image...");
            String bannerBase64 = loadBannerImage();
            log.info("=== EMAIL SERVICE: Banner loaded, base64 length: {}", bannerBase64.length());

            log.info("=== EMAIL SERVICE: Building Mailjet request...");
            log.info("=== EMAIL SERVICE: From: {} <{}>, To: {} <{}>", 
                mailjetConfig.getFromName(), mailjetConfig.getFromEmail(), customerName, customerEmail);
            
            // Build Mailjet request with inline image
            MailjetRequest request = new MailjetRequest(Emailv31.resource)
                .property(Emailv31.MESSAGES, new JSONArray()
                    .put(new JSONObject()
                        .put(Emailv31.Message.FROM, new JSONObject()
                            .put("Email", mailjetConfig.getFromEmail())
                            .put("Name", mailjetConfig.getFromName()))
                        .put(Emailv31.Message.TO, new JSONArray()
                            .put(new JSONObject()
                                .put("Email", customerEmail)
                                .put("Name", customerName)))
                        .put(Emailv31.Message.SUBJECT, "Xác nhận đặt phòng - " + booking.getBookingCode())
                        .put(Emailv31.Message.HTMLPART, htmlContent)
                        .put(Emailv31.Message.INLINEDATTACHMENTS, new JSONArray()
                            .put(new JSONObject()
                                .put("ContentType", "image/jpeg")
                                .put("Filename", "aurora-banner.jpg")
                                .put("ContentID", "aurora-banner")
                                .put("Base64Content", bannerBase64)))
                        .put(Emailv31.Message.CUSTOMID, "BookingConfirmation-" + booking.getBookingCode())));

            log.info("=== EMAIL SERVICE: Sending email via Mailjet...");
            // Send email
            MailjetResponse response = mailjetClient.post(request);
            
            log.info("=== EMAIL SERVICE: Mailjet response status: {}", response.getStatus());
            log.info("=== EMAIL SERVICE: Mailjet response data: {}", response.getData());
            
            if (response.getStatus() == 200) {
                log.info("=== EMAIL SERVICE: ✅ Email sent successfully to: {} for booking: {}", 
                    customerEmail, booking.getBookingCode());
                booking.setEmailSent(true);
            } else {
                log.error("=== EMAIL SERVICE: ❌ Failed to send email. Status: {}, Response: {}", 
                    response.getStatus(), response.getData());
            }
            
        } catch (Exception e) {
            log.error("=== EMAIL SERVICE: ❌ Exception while sending email for booking: {}", 
                booking.getBookingCode(), e);
        }
    }
    
    private String loadBannerImage() throws IOException {
        try {
            ClassPathResource imageResource = new ClassPathResource("images/aurora-banner.jpg");
            byte[] imageBytes = imageResource.getInputStream().readAllBytes();
            return Base64.getEncoder().encodeToString(imageBytes);
        } catch (IOException e) {
            log.warn("Could not load banner image, email will be sent without banner", e);
            return "";
        }
    }

    private String generateBookingConfirmationHtml(Booking booking) {
        // Create Thymeleaf template engine
        ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
        templateResolver.setPrefix("templates/email/");
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode(TemplateMode.HTML);
        templateResolver.setCharacterEncoding("UTF-8");
        templateResolver.setCacheable(false);

        TemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(templateResolver);

        // Prepare template context
        Context context = new Context();
        context.setVariable("booking", booking);
        context.setVariable("bookingCode", booking.getBookingCode());
        
        // Customer info
        String customerName = booking.getCustomer() != null 
            ? (booking.getCustomer().getFirstName() != null && booking.getCustomer().getLastName() != null 
                ? booking.getCustomer().getFirstName() + " " + booking.getCustomer().getLastName()
                : booking.getCustomer().getUsername())
            : booking.getGuestFullName();
        String customerEmail = booking.getCustomer() != null 
            ? booking.getCustomer().getEmail() 
            : booking.getGuestEmail();
        String customerPhone = booking.getCustomer() != null 
            ? booking.getCustomer().getPhone() 
            : booking.getGuestPhone();
            
        context.setVariable("customerName", customerName);
        context.setVariable("customerEmail", customerEmail);
        context.setVariable("customerPhone", customerPhone);
        
        // Dates
        context.setVariable("checkinDate", booking.getCheckin().format(DATE_FORMATTER));
        context.setVariable("checkoutDate", booking.getCheckout().format(DATE_FORMATTER));
        context.setVariable("bookingDate", booking.getCreatedAt().format(DATETIME_FORMATTER));
        
        // Branch info
        context.setVariable("branchName", booking.getBranch().getName());
        context.setVariable("branchAddress", booking.getBranch().getAddress());
        context.setVariable("branchPhone", booking.getBranch().getPhone());
        context.setVariable("branchEmail", booking.getBranch().getEmail());
        
        // Room details
        List<Map<String, Object>> roomDetails = booking.getRooms().stream()
            .map(bookingRoom -> {
                Map<String, Object> room = new HashMap<>();
                room.put("name", bookingRoom.getRoom().getRoomType().getName());
                room.put("number", bookingRoom.getRoom().getRoomNumber());
                room.put("price", formatCurrency(bookingRoom.getPricePerNight()));
                room.put("nights", bookingRoom.getNights());
                room.put("total", formatCurrency(
                    bookingRoom.getPricePerNight().multiply(
                        BigDecimal.valueOf(bookingRoom.getNights()))));
                return room;
            })
            .collect(Collectors.toList());
        context.setVariable("rooms", roomDetails);
        
        // Pricing
        context.setVariable("subtotal", formatCurrency(booking.getSubtotalPrice()));
        context.setVariable("discount", formatCurrency(
            booking.getDiscountAmount() != null ? booking.getDiscountAmount() : BigDecimal.ZERO));
        context.setVariable("total", formatCurrency(booking.getTotalPrice()));
        
        // Payment info
        context.setVariable("paymentStatus", getPaymentStatusText(booking.getPaymentStatus()));
        context.setVariable("bookingStatus", getBookingStatusText(booking.getStatus()));
        
        // Special request
        context.setVariable("specialRequest", 
            booking.getSpecialRequest() != null ? booking.getSpecialRequest() : "Không có");

        // Process template
        return templateEngine.process("booking-confirmation", context);
    }

    private String formatCurrency(BigDecimal amount) {
        return String.format("%,d VNĐ", amount.longValue());
    }

    private String getPaymentStatusText(Booking.PaymentStatus status) {
        return switch (status) {
            case PENDING -> "Chờ thanh toán";
            case DEPOSIT_PAID -> "Đã đặt cọc";
            case PARTIALLY_PAID -> "Thanh toán một phần";
            case PAID -> "Đã thanh toán";
            case REFUNDED -> "Đã hoàn tiền";
        };
    }

    private String getBookingStatusText(Booking.BookingStatus status) {
        return switch (status) {
            case PENDING -> "Chờ xác nhận";
            case CONFIRMED -> "Đã xác nhận";
            case CHECKED_IN -> "Đã check-in";
            case CHECKED_OUT -> "Đã check-out";
            case COMPLETED -> "Hoàn thành";
            case CANCELLED -> "Đã hủy";
            case NO_SHOW -> "Không đến";
        };
    }
}
