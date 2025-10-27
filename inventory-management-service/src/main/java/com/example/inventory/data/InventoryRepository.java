package com.example.inventory.data;

import com.example.inventory.model.InventoryItem;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class InventoryRepository {
  private final List<InventoryItem> items = List.of(
    new InventoryItem(1, "Ohio State Buckeyes Jacket", 79.99, 42),
    new InventoryItem(2, "Buckeyes Smith #4 Jersey",     109.99, 18),
    new InventoryItem(3, "Ohio State Polo Shirt",       54.99, 7),
    new InventoryItem(4, "Buckeyes Hoodie",    64.99, 15),
    new InventoryItem(5, "White OSU 1968 Championship T-Shirt",    29.99, 6)
  );

  public List<InventoryItem> findAll() { return items; }

  public Optional<InventoryItem> findById(long id) {
    return items.stream().filter(i -> i.id() == id).findFirst();
  }

  public List<InventoryItem> findByName(String name) {
    String q = name.toLowerCase();
    return items.stream()
      .filter(i -> i.name().toLowerCase().contains(q))
      .collect(Collectors.toList());
  }
}