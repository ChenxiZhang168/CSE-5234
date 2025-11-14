package com.example.order_processing.model;

public class OrderItem {
    private Long id;
    private Long itemId;
    private String itemName;
    private double unitPriceAtPurchase;
    private int quantity;
    private Long customerOrderId;

    public OrderItem() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public double getUnitPriceAtPurchase() {
        return unitPriceAtPurchase;
    }

    public void setUnitPriceAtPurchase(double unitPriceAtPurchase) {
        this.unitPriceAtPurchase = unitPriceAtPurchase;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Long getCustomerOrderId() {
        return customerOrderId;
    }

    public void setCustomerOrderId(Long customerOrderId) {
        this.customerOrderId = customerOrderId;
    }
}