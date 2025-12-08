package com.aurora.backend.enums;

public enum NewsStatus {
    DRAFT("draft"),
    PUBLISHED("published"),
    ARCHIVED("archived");

    private final String value;

    NewsStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}