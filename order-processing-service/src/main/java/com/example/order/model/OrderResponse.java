package com.example.order.model;

import java.util.List;

public record OrderResponse(String status, String confirmationNumber, String reason, List<MissingItem> missing) {
  public static OrderResponse accepted(String conf) { return new OrderResponse("ACCEPTED", conf, null, null); }
  public static OrderResponse rejected(String reason, List<MissingItem> miss) { return new OrderResponse("REJECTED", null, reason, miss); }
}