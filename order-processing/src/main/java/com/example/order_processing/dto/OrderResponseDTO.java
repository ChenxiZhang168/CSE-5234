package com.example.order_processing.dto;

public class OrderResponseDTO {
    private String confirmationNumber;
    private String status;
    private String message;

    public OrderResponseDTO() {}

    public OrderResponseDTO(String confirmationNumber, String status, String message) {
        this.confirmationNumber = confirmationNumber;
        this.status = status;
        this.message = message;
    }

    public String getConfirmationNumber() {
        return confirmationNumber;
    }

    public void setConfirmationNumber(String confirmationNumber) {
        this.confirmationNumber = confirmationNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}