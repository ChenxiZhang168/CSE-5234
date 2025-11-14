package com.example.order_processing.dto;

public class PaymentResponseDTO {

    private Long paymentInfoId; // FK → payment_info.id
    private String status;      // "APPROVED", "DECLINED"
    private String message;

    public PaymentResponseDTO() {}

    public PaymentResponseDTO(Long paymentInfoId, String status, String message) {
        this.paymentInfoId = paymentInfoId;
        this.status = status;
        this.message = message;
    }

    public Long getPaymentInfoId() {
        return paymentInfoId;
    }

    public void setPaymentInfoId(Long paymentInfoId) {
        this.paymentInfoId = paymentInfoId;
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