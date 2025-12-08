package com.aurora.backend.enums;

public enum ImageStatus {
    TEMP("temp"),
    ATTACHED("attached"),
    DELETED("deleted");

    private final String value;

    ImageStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}