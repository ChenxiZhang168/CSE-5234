package com.example.order_processing.controller;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.example.order_processing.client.*;
import com.example.order_processing.dto.*;
import com.example.order_processing.model.Order;
import com.example.order_processing.model.OrderItem;
import com.example.order_processing.model.ShippingInfo;
import com.example.order_processing.repo.OrderRepository;
import com.google.gson.Gson;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class OrderController implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final Gson gson = new Gson();

    private final OrderRepository orderRepository;
    private final InventoryClient inventoryClient;
    private final PaymentClient paymentClient;
    private final ShippingEventPublisher shippingEventPublisher;
    private static final double PER_ITEM_WEIGHT = 1.0; // lb per unit
    private static final String DEFAULT_BUSINESS_ID = "OSU-STORE-001";

    public OrderController() {
        String inventoryBaseUrl = System.getenv("INVENTORY_BASE_URL");
        String paymentBaseUrl = System.getenv("PAYMENT_BASE_URL");

        this.orderRepository = new OrderRepository();
        this.inventoryClient = new InventoryClient(inventoryBaseUrl);
        this.paymentClient = new PaymentClient(paymentBaseUrl);
        this.shippingEventPublisher = new ShippingEventPublisher();
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            if (!"POST".equalsIgnoreCase(request.getHttpMethod())) {
                return createResponse(405, "Method Not Allowed");
            }

            OrderRequestDTO orderRequest = gson.fromJson(request.getBody(), OrderRequestDTO.class);

            // 1. Validate inventory
            boolean ok = inventoryClient.validateQuantities(orderRequest.getItems());
            if (!ok) {
                OrderResponseDTO resp = new OrderResponseDTO(null, "REJECTED",
                        "Insufficient inventory for one or more items.");
                return json(400, resp);
            }

            // 2. Compute total based on unit_price_at_purchase * quantity
            double totalAmount = computeTotalAmount(orderRequest.getItems());

            PaymentRequestDTO paymentRequest = new PaymentRequestDTO(orderRequest.getPaymentInfo(), totalAmount);

            // 3. Call payment service
            PaymentResponseDTO paymentResponse = paymentClient.processPayment(paymentRequest);
            if (!"APPROVED".equalsIgnoreCase(paymentResponse.getStatus())) {
                OrderResponseDTO resp = new OrderResponseDTO(
                        null,
                        "PAYMENT_FAILED",
                        "Payment failed: " + paymentResponse.getMessage()
                );
                return json(402, resp);
            }

            // 4. Persist order with FK to payment_info.id
            Order order = mapToOrder(orderRequest, paymentResponse.getPaymentInfoId());
            String confirmationNumber = orderRepository.save(order);
            
            // 5. Publish shipping event asynchronously via EventBridge
            try {
                ShippingRequestDTO shippingRequest = buildShippingRequest(orderRequest, order);
                shippingEventPublisher.publishShippingRequested(shippingRequest);
            } catch (Exception ex) {
                if (context != null && context.getLogger() != null) {
                    context.getLogger().log("Failed to publish shipping event: " + ex.getMessage());
                }
            }
            
            // 6. Response to frontend
            OrderResponseDTO resp = new OrderResponseDTO(
                    confirmationNumber,
                    "CONFIRMED",
                    "Order placed successfully."
            );
            return json(200, resp);

        } catch (Exception e) {
            return createResponse(500, "Internal Server Error: " + e.getMessage());
        }
    }

    private Order mapToOrder(OrderRequestDTO dto, Long paymentInfoId) {
        Order order = new Order();
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerEmail(dto.getCustomerEmail());

        // Attach full ShippingInfo so the repository can persist shipping_info row
        ShippingInfo shippingInfo = dto.getShippingInfo();
        order.setShippingInfo(shippingInfo);

        order.setStatus("Paid");
        order.setPaymentInfoId(paymentInfoId);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> items = dto.getItems().stream()
                .map(i -> {
                    OrderItem li = new OrderItem();
                    li.setItemId(i.getItemId());
                    li.setItemName(i.getItemName());
                    li.setUnitPriceAtPurchase(i.getUnitPriceAtPurchase());
                    li.setQuantity(i.getQuantity());
                    return li;
                })
                .collect(Collectors.toList());

        order.setItems(items);
        return order;
    }

    // TODO: frontend might have the total amount
    private double computeTotalAmount(List<OrderItemDTO> items) {
        double total = 0.0;
        if (items != null) {
            for (OrderItemDTO item : items) {
                total += item.getUnitPriceAtPurchase() * item.getQuantity();
            }
        }
        return total;
    }

    private ShippingRequestDTO buildShippingRequest(OrderRequestDTO requestDto, Order order) {
        ShippingRequestDTO dto = new ShippingRequestDTO();

        // Business ID – constant or from env
        String businessId = System.getenv("BUSINESS_ID");
        if (businessId == null || businessId.isEmpty()) {
            businessId = DEFAULT_BUSINESS_ID;
        }
        dto.setBusinessId(businessId);

        // Map address from ShippingInfo on the request
        ShippingInfo shippingInfo = requestDto.getShippingInfo();
        if (shippingInfo != null) {
            dto.setAddress1(shippingInfo.getAddress1());
            dto.setAddress2(shippingInfo.getAddress2());
            dto.setCity(shippingInfo.getCity());
            dto.setState(shippingInfo.getState());
            dto.setCountry(shippingInfo.getCountry());
            dto.setPostalCode(shippingInfo.getPostalCode());
        } else {
            // Fallback defaults if shippingInfo is missing
            dto.setAddress1(null);
            dto.setAddress2(null);
            dto.setCity(null);
            dto.setState(null);
            dto.setCountry(null);
            dto.setPostalCode(null);
        }

        // numPackets = number of distinct line items
        int numPackets = 0;
        int totalQuantity = 0;
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                numPackets += 1;
                totalQuantity += item.getQuantity();
            }
        }

        if (numPackets == 0) {
            numPackets = 1; // avoid divide by zero; should not really happen
        }

        double totalWeight = totalQuantity * PER_ITEM_WEIGHT;
        double weightPerPacket = totalWeight / numPackets;

        dto.setNumPackets(numPackets);
        dto.setWeightPerPacket(weightPerPacket);

        return dto;
    }
    private APIGatewayProxyResponseEvent json(int statusCode, Object bodyObj) {
        String json = gson.toJson(bodyObj);
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(statusCode)
                .withHeaders(Map.of(
                        "Content-Type", "application/json",
                        "Access-Control-Allow-Origin", "*"
                ))
                .withBody(json);
    }

    private APIGatewayProxyResponseEvent createResponse(int statusCode, String message) {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(statusCode)
                .withHeaders(Map.of(
                        "Content-Type", "text/plain",
                        "Access-Control-Allow-Origin", "*"
                ))
                .withBody(message);
    }
}