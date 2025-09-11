package com.aurora.backend.enums;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // User errors
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1003, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1004, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1005, "You do not have permission", HttpStatus.FORBIDDEN),
    USERNAME_INVALID(1006, "Username must be at least 4 characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1007, "Password must be at least 6 characters", HttpStatus.BAD_REQUEST),
    USER_UPDATE_FAILED(1008, "Failed to update user", HttpStatus.BAD_REQUEST),
    USER_DELETE_FAILED(1009, "Failed to delete user", HttpStatus.BAD_REQUEST),
    USERNAME_REQUIRED(1010, "Username is required", HttpStatus.BAD_REQUEST),
    PASSWORD_REQUIRED(1011, "Password is required", HttpStatus.BAD_REQUEST),
    FIRSTNAME_REQUIRED(1012, "First name is required", HttpStatus.BAD_REQUEST),
    LASTNAME_REQUIRED(1013, "Last name is required", HttpStatus.BAD_REQUEST),
    DOB_INVALID(1014, "Date of birth must be in the past", HttpStatus.BAD_REQUEST),
    
    // Amenity errors
    AMENITY_EXISTED(1100, "Amenity already exists", HttpStatus.BAD_REQUEST),
    AMENITY_NOT_EXISTED(1101, "Amenity not found", HttpStatus.NOT_FOUND),
    AMENITY_NAME_REQUIRED(1102, "Amenity name is required", HttpStatus.BAD_REQUEST),
    AMENITY_TYPE_REQUIRED(1103, "Amenity type is required", HttpStatus.BAD_REQUEST),
    
    // Facility errors
    FACILITY_EXISTED(1200, "Facility already exists in this hotel", HttpStatus.BAD_REQUEST),
    FACILITY_NOT_EXISTED(1201, "Facility not found", HttpStatus.NOT_FOUND),
    FACILITY_NAME_REQUIRED(1202, "Facility name is required", HttpStatus.BAD_REQUEST),
    HOTEL_ID_REQUIRED(1203, "Hotel ID is required", HttpStatus.BAD_REQUEST),
    HOTEL_NOT_EXISTED(1204, "Hotel not found", HttpStatus.NOT_FOUND),
    
    // Hotel errors
    HOTEL_EXISTED(1500, "Hotel code already exists", HttpStatus.BAD_REQUEST),
    HOTEL_NAME_REQUIRED(1501, "Hotel name is required", HttpStatus.BAD_REQUEST),
    HOTEL_CODE_REQUIRED(1502, "Hotel code is required", HttpStatus.BAD_REQUEST),
    HOTEL_ADDRESS_REQUIRED(1503, "Hotel address is required", HttpStatus.BAD_REQUEST),
    PHONE_INVALID(1504, "Phone number format is invalid", HttpStatus.BAD_REQUEST),
    TIME_FORMAT_INVALID(1505, "Time format must be HH:MM", HttpStatus.BAD_REQUEST),
    
    // Booking errors
    BOOKING_NOT_EXISTED(1300, "Booking not found", HttpStatus.NOT_FOUND),
    BOOKING_DATE_INVALID(1301, "Check-in date must be before check-out date", HttpStatus.BAD_REQUEST),
    BOOKING_DATE_REQUIRED(1302, "Check-in and check-out dates are required", HttpStatus.BAD_REQUEST),
    BOOKING_CODE_REQUIRED(1303, "Booking code is required", HttpStatus.BAD_REQUEST),
    CUSTOMER_ID_REQUIRED(1304, "Customer ID is required", HttpStatus.BAD_REQUEST),
    CHECKIN_DATE_FUTURE(1305, "Check-in date must be in the future", HttpStatus.BAD_REQUEST),
    CHECKOUT_DATE_FUTURE(1306, "Check-out date must be in the future", HttpStatus.BAD_REQUEST),
    BOOKING_CODE_EXISTED(1307, "Booking code already exists", HttpStatus.BAD_REQUEST),
    
    // BookingRoom errors
    BOOKING_ROOM_NOT_EXISTED(1400, "Booking room not found", HttpStatus.NOT_FOUND),
    BOOKING_ID_REQUIRED(1401, "Booking ID is required", HttpStatus.BAD_REQUEST),
    ROOM_ID_REQUIRED(1402, "Room ID is required", HttpStatus.BAD_REQUEST),
    PRICE_REQUIRED(1404, "Price is required", HttpStatus.BAD_REQUEST),
    PRICE_POSITIVE(1405, "Price must be positive", HttpStatus.BAD_REQUEST),
    NIGHTS_REQUIRED(1406, "Nights is required", HttpStatus.BAD_REQUEST),
    NIGHTS_POSITIVE(1407, "Nights must be positive", HttpStatus.BAD_REQUEST),
    BOOKING_ROOM_EXISTED(1408, "Room already booked for this booking", HttpStatus.BAD_REQUEST),
    
    // Payment errors
    PAYMENT_NOT_EXISTED(1600, "Payment not found", HttpStatus.NOT_FOUND),
    PAYMENT_METHOD_REQUIRED(1601, "Payment method is required", HttpStatus.BAD_REQUEST),
    PAYMENT_STATUS_REQUIRED(1602, "Payment status is required", HttpStatus.BAD_REQUEST),
    PAYMENT_AMOUNT_REQUIRED(1603, "Payment amount is required", HttpStatus.BAD_REQUEST),
    PAYMENT_AMOUNT_POSITIVE(1604, "Payment amount must be positive", HttpStatus.BAD_REQUEST),
    
    // Role errors
    ROLE_NOT_EXISTED(1700, "Role not found", HttpStatus.NOT_FOUND),
    ROLE_EXISTED(1701, "Role already exists", HttpStatus.BAD_REQUEST),
    ROLE_NAME_REQUIRED(1702, "Role name is required", HttpStatus.BAD_REQUEST),
    
    // Permission errors
    PERMISSION_NOT_EXISTED(1800, "Permission not found", HttpStatus.NOT_FOUND),
    PERMISSION_EXISTED(1801, "Permission already exists", HttpStatus.BAD_REQUEST),
    PERMISSION_CODE_REQUIRED(1802, "Permission code is required", HttpStatus.BAD_REQUEST),
    
    // Promotion errors
    PROMOTION_NOT_EXISTED(1900, "Promotion not found", HttpStatus.NOT_FOUND),
    PROMOTION_EXISTED(1901, "Promotion code already exists", HttpStatus.BAD_REQUEST),
    PROMOTION_CODE_REQUIRED(1902, "Promotion code is required", HttpStatus.BAD_REQUEST),
    PROMOTION_NAME_REQUIRED(1903, "Promotion name is required", HttpStatus.BAD_REQUEST),
    PROMOTION_DATE_INVALID(1904, "Start date must be before end date", HttpStatus.BAD_REQUEST),
    DISCOUNT_REQUIRED(1905, "Discount is required", HttpStatus.BAD_REQUEST),
    DISCOUNT_POSITIVE(1906, "Discount must be positive or zero", HttpStatus.BAD_REQUEST),
    START_DATE_REQUIRED(1907, "Start date is required", HttpStatus.BAD_REQUEST),
    END_DATE_REQUIRED(1908, "End date is required", HttpStatus.BAD_REQUEST),
    
    // RoomType errors
    ROOM_TYPE_NOT_EXISTED(2000, "Room type not found", HttpStatus.NOT_FOUND),
    ROOM_TYPE_EXISTED(2001, "Room type already exists", HttpStatus.BAD_REQUEST),
    ROOM_TYPE_NAME_REQUIRED(2002, "Room type name is required", HttpStatus.BAD_REQUEST),
    CAPACITY_ADULTS_REQUIRED(2003, "Capacity adults is required", HttpStatus.BAD_REQUEST),
    CAPACITY_ADULTS_POSITIVE(2004, "Capacity adults must be positive", HttpStatus.BAD_REQUEST),
    CAPACITY_CHILDREN_POSITIVE(2005, "Capacity children must be positive", HttpStatus.BAD_REQUEST),
    SIZE_POSITIVE(2006, "Room size must be positive", HttpStatus.BAD_REQUEST),
    
    // Room errors  
    ROOM_NOT_FOUND(2100, "Room not found", HttpStatus.NOT_FOUND),
    ROOM_NUMBER_ALREADY_EXISTS(2101, "Room number already exists in this hotel", HttpStatus.BAD_REQUEST),
    ROOM_NUMBER_REQUIRED(2102, "Room number is required", HttpStatus.BAD_REQUEST),
    ROOM_TYPE_ID_REQUIRED(2103, "Room type ID is required", HttpStatus.BAD_REQUEST),
    FLOOR_POSITIVE(2104, "Floor number must be positive", HttpStatus.BAD_REQUEST),
    ROOM_TYPE_HOTEL_MISMATCH(2105, "Room type does not belong to the specified hotel", HttpStatus.BAD_REQUEST),
    HOTEL_NOT_FOUND(2106, "Hotel not found", HttpStatus.NOT_FOUND),
    ROOM_TYPE_NOT_FOUND(2107, "Room type not found", HttpStatus.NOT_FOUND),
    
    // Service errors
    SERVICE_NOT_FOUND(2200, "Service not found", HttpStatus.NOT_FOUND),
    SERVICE_EXISTED(2201, "Service already exists in this hotel", HttpStatus.BAD_REQUEST),
    SERVICE_NAME_REQUIRED(2202, "Service name is required", HttpStatus.BAD_REQUEST),
    BASE_PRICE_POSITIVE(2203, "Base price must be positive", HttpStatus.BAD_REQUEST),
    
    // ServiceBooking errors
    SERVICE_BOOKING_NOT_FOUND(2300, "Service booking not found", HttpStatus.NOT_FOUND),
    SERVICE_BOOKING_EXISTED(2301, "Service already booked for this booking", HttpStatus.BAD_REQUEST),
    SERVICE_ID_REQUIRED(2302, "Service ID is required", HttpStatus.BAD_REQUEST),
    DATETIME_REQUIRED(2303, "Date time is required", HttpStatus.BAD_REQUEST),
    QUANTITY_POSITIVE(2304, "Quantity must be positive", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_FOUND(2305, "Booking not found", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND(2306, "User not found", HttpStatus.NOT_FOUND),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}