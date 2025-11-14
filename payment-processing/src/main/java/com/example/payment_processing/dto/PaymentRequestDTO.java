package com.example.payment_processing.dto;

import com.example.payment_processing.model.PaymentInfo;

public class PaymentRequestDTO {

    private PaymentInfo paymentInfo;
    private double totalAmount;

    public PaymentRequestDTO() {}

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