package com.example.order.inventory;

import java.net.URI;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class InventoryClient {
  private final RestTemplate rest = new RestTemplate();
  @Value("${inventory.base-url}") String base;

  public int getAvailableQty(long itemId) {
    URI url = URI.create(base + "/inventory/items/" + itemId);
    Map<?,?> body = rest.getForObject(url, Map.class);
    Object a = body == null ? 0 : body.get("availableQty");
    return a == null ? 0 : Integer.parseInt(a.toString());
  }
}