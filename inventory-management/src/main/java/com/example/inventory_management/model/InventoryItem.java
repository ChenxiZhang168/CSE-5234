package com.example.inventory_management.model;

public class InventoryItem {

    private long id;
    private int itemNumber;
    private String name;
    private String description;
    private int availableQuantity;
    private double unitPrice;

    public InventoryItem() {}

    public InventoryItem(long id, int itemNumber, String name, String description,
                         int availableQuantity, double unitPrice) {
        this.id = id;
        this.itemNumber = itemNumber;
        this.name = name;
        this.description = description;
        this.availableQuantity = availableQuantity;
        this.unitPrice = unitPrice;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getItemNumber() {
        return itemNumber;
    }

    public void setItemNumber(int itemNumber) {
        this.itemNumber = itemNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(int availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    // For debug use
    @Override
    public String toString() {
        return "InventoryItem{" +
                "id=" + id +
                ", itemNumber=" + itemNumber +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", availableQuantity=" + availableQuantity +
                ", unitPrice=" + unitPrice +
                '}';
    }
}
