package com.example.order_processing.dto;

public class OrderItemDTO {

    private long itemId;
    private String itemName;
    private double unitPriceAtPurchase;
    private int quantity;

    public OrderItemDTO() {}

    public long getItemId() {
        return itemId;
    }

    public void setItemId(long itemId) {
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
}