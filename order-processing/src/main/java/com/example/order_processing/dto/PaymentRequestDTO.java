package com.example.order_processing.dto;

import com.example.order_processing.model.PaymentInfo;

public class PaymentRequestDTO {
    private PaymentInfo paymentInfo;
    private double totalAmount;

    public PaymentRequestDTO() {}

    public PaymentRequestDTO(PaymentInfo paymentInfo, double totalAmount) {
        this.paymentInfo = paymentInfo;
        this.totalAmount = totalAmount;
    }

    public PaymentInfo getPaymentInfo() {
        return paymentInfo;
    }

    public void setPaymentInfo(PaymentInfo paymentInfo) {
        this.paymentInfo = paymentInfo;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
}