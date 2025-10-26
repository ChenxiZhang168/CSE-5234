package com.example.order.model;

import java.util.List;

public record OrderRequest(List<OrderItem> items, Payment payment, Shipping shipping) {}