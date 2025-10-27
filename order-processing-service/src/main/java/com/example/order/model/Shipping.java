package com.example.order.model;

public record Shipping(
  String name, String addressLine1, String addressLine2, String city, String state, String zip) {}