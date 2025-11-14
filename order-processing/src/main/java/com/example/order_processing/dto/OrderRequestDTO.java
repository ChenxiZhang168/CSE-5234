package com.example.order_processing.dto;

import com.example.order_processing.model.PaymentInfo;
import com.example.order_processing.model.ShippingInfo;
import java.util.List;

public class OrderRequestDTO {

    private String customerName;
    private String customerEmail;

    private ShippingInfo shippingInfo;

    private List<OrderItemDTO> items;

    // full card info from UI, passed to payment service
    private PaymentInfo paymentInfo;

    public OrderRequestDTO() {}

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public ShippingInfo getShippingInfo() {
        return shippingInfo;
    }

    public void setShippingInfo(ShippingInfo shippingInfo) {
        this.shippingInfo = shippingInfo;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public PaymentInfo getPaymentInfo() {
        return paymentInfo;
    }

    public void setPaymentInfo(PaymentInfo paymentInfo) {
        this.paymentInfo = paymentInfo;
    }
}