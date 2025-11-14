package com.example.shipment_processing.dto;

public class ShippingResponseDTO {

    private String token;
    private String status;
    private String message;

    public ShippingResponseDTO() {}

    public ShippingResponseDTO(String token, String status, String message) {
        this.token = token;
        this.status = status;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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
