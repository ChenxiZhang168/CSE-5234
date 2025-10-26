package com.example.order.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.order.inventory.InventoryClient;
import com.example.order.model.MissingItem;
import com.example.order.model.OrderRequest;
import com.example.order.model.OrderResponse;

@Service
public class OrderService {
  private final InventoryClient inventory;
  public OrderService(InventoryClient inventory) { this.inventory = inventory; }

  public OrderResponse placeOrder(OrderRequest req) {
    if (req == null || req.items() == null || req.items().isEmpty()
        || req.payment() == null || req.shipping() == null)
      return OrderResponse.rejected("BAD_REQUEST_MISSING_FIELDS", List.of());

    List<MissingItem> missing = new ArrayList<>();
    for (var it : req.items()) {
      int available = inventory.getAvailableQty(it.id());
      if (it.qty() <= 0 || it.qty() > available) {
        missing.add(new MissingItem(it.id(), it.qty(), available));
      }
    }
    if (!missing.isEmpty())
      return OrderResponse.rejected("INSUFFICIENT_INVENTORY", missing);

    String conf = "ORD-" + java.time.LocalDate.now().toString().replace("-", "")
                  + "-" + (1000 + new java.util.Random().nextInt(9000));
    return OrderResponse.accepted(conf);
  }
}