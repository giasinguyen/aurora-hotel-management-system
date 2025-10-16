package com.aurora.backend.constant;

public final class PermissionConstants {
    
    private PermissionConstants() {}

    public static final class Guest {
        public static final String HOTEL_VIEW = "HOTEL_VIEW";
        public static final String ROOM_VIEW = "ROOM_VIEW";
        public static final String ROOM_SEARCH = "ROOM_SEARCH";
        public static final String PROMOTION_VIEW = "PROMOTION_VIEW";
        public static final String SERVICE_VIEW = "SERVICE_VIEW";
    }

    public static final class Customer {
        public static final String BOOKING_CREATE = "BOOKING_CREATE";
        public static final String BOOKING_VIEW_OWN = "BOOKING_VIEW_OWN";
        public static final String BOOKING_CANCEL_OWN = "BOOKING_CANCEL_OWN";
        public static final String BOOKING_UPDATE_OWN = "BOOKING_UPDATE_OWN";
        public static final String PAYMENT_CREATE = "PAYMENT_CREATE";
        public static final String PAYMENT_VIEW_OWN = "PAYMENT_VIEW_OWN";
        public static final String PROFILE_VIEW = "PROFILE_VIEW";
        public static final String PROFILE_UPDATE = "PROFILE_UPDATE";
        public static final String SERVICE_REGISTER = "SERVICE_REGISTER";
    }

    public static final class Staff {
        public static final String BOOKING_VIEW_ALL = "BOOKING_VIEW_ALL";
        public static final String BOOKING_CREATE_MANUAL = "BOOKING_CREATE_MANUAL";
        public static final String BOOKING_UPDATE_ALL = "BOOKING_UPDATE_ALL";
        public static final String BOOKING_CANCEL_ALL = "BOOKING_CANCEL_ALL";
        public static final String ROOM_STATUS_UPDATE = "ROOM_STATUS_UPDATE";
        public static final String CHECKIN_PROCESS = "CHECKIN_PROCESS";
        public static final String CHECKOUT_PROCESS = "CHECKOUT_PROCESS";
        public static final String CUSTOMER_VIEW = "CUSTOMER_VIEW";
        public static final String PAYMENT_VIEW_ALL = "PAYMENT_VIEW_ALL";
        public static final String SERVICE_MANAGE = "SERVICE_MANAGE";
    }

    public static final class Manager {
        public static final String BOOKING_APPROVE = "BOOKING_APPROVE";
        public static final String ROOM_CREATE = "ROOM_CREATE";
        public static final String ROOM_UPDATE = "ROOM_UPDATE";
        public static final String ROOM_DELETE = "ROOM_DELETE";
        public static final String PRICE_UPDATE = "PRICE_UPDATE";
        public static final String PROMOTION_CREATE = "PROMOTION_CREATE";
        public static final String PROMOTION_UPDATE = "PROMOTION_UPDATE";
        public static final String PROMOTION_DELETE = "PROMOTION_DELETE";
        public static final String HOTEL_UPDATE = "HOTEL_UPDATE";
        public static final String REPORT_VIEW = "REPORT_VIEW";
        public static final String REPORT_EXPORT = "REPORT_EXPORT";
        public static final String STAFF_VIEW = "STAFF_VIEW";
    }

    public static final class Admin {
        public static final String USER_CREATE = "USER_CREATE";
        public static final String USER_UPDATE = "USER_UPDATE";
        public static final String USER_DELETE = "USER_DELETE";
        public static final String USER_LOCK = "USER_LOCK";
        public static final String ROLE_ASSIGN = "ROLE_ASSIGN";
        public static final String ROLE_CREATE = "ROLE_CREATE";
        public static final String ROLE_UPDATE = "ROLE_UPDATE";
        public static final String ROLE_DELETE = "ROLE_DELETE";
        public static final String PERMISSION_MANAGE = "PERMISSION_MANAGE";
        public static final String SYSTEM_CONFIG = "SYSTEM_CONFIG";
        public static final String BACKUP_MANAGE = "BACKUP_MANAGE";
        public static final String LOG_VIEW = "LOG_VIEW";
        public static final String HOTEL_CREATE = "HOTEL_CREATE";
        public static final String HOTEL_DELETE = "HOTEL_DELETE";
    }
}
