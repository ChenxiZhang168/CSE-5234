// src/main/java/com/example/inventory/model/InventoryItem.java
package com.example.inventory.model;

public record InventoryItem(long id, String name, double price, int availableQty) {}