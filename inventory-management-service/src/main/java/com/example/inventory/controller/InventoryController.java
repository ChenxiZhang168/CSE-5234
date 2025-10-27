package com.example.inventory.controller;

import com.example.inventory.data.InventoryRepository;
import com.example.inventory.model.InventoryItem;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
  private final InventoryRepository repo;
  public InventoryController(InventoryRepository repo) { this.repo = repo; }

  @GetMapping("/items")
  public List<InventoryItem> getAll(@RequestParam(value = "name", required = false) String name) {
    if (name != null && !name.isBlank()) return repo.findByName(name);
    return repo.findAll();
  }

  @GetMapping("/items/{id}")
  public ResponseEntity<InventoryItem> getById(@PathVariable long id) {
    return repo.findById(id).map(ResponseEntity::ok)
               .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
  }
}