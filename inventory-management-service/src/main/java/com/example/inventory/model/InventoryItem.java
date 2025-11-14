package com.example.inventory.model;

public record InventoryItem(
    long id,
    int item_number,
    String name,
    String description,
    int available_quantity,
    double unit_price
) {}