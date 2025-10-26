package com.example.order.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.order.model.OrderRequest;
import com.example.order.model.OrderResponse;
import com.example.order.service.OrderService;

@RestController
@RequestMapping("/order-processing")
public class OrderController {
  private final OrderService svc;
  public OrderController(OrderService svc) { this.svc = svc; }

  @PostMapping("/order")
  public ResponseEntity<OrderResponse> create(@RequestBody OrderRequest req) {
    OrderResponse r = svc.placeOrder(req);
    if ("ACCEPTED".equals(r.status())) return ResponseEntity.ok(r);
    if ("REJECTED".equals(r.status()) && "INSUFFICIENT_INVENTORY".equals(r.reason()))
      return ResponseEntity.status(HttpStatus.CONFLICT).body(r);
    return ResponseEntity.badRequest().body(r);
  }
}