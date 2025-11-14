package com.example.inventory_management.controller;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.example.inventory_management.model.InventoryItem;
import com.example.inventory_management.repo.InventoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * AWS Lambda handler for the inventory-management microservice.
 *
 * Supports the following REST-style endpoints (via API Gateway):
 *
 *   GET /inventory-management/inventory
 *       -> returns all inventory items as JSON array
 *
 *   GET /inventory-management/inventory/items/{id}
 *       -> returns a single inventory item with the given id
 *
 *   GET /inventory-management/inventory/items?name={itemName}
 *       -> returns items whose name contains the given substring (case-insensitive)
 */
public class InventoryController implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private final InventoryRepository inventoryRepository = new InventoryRepository();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent event, Context context) {
        String httpMethod = event.getHttpMethod();
        String path = event.getPath();

        try {
            if (!"GET".equalsIgnoreCase(httpMethod)) {
                return response(405, "{\"error\":\"Method not allowed\"}");
            }

            // GET /inventory-management/inventory
            if (path != null && path.endsWith("/inventory")) {
                List<InventoryItem> items = inventoryRepository.findAll();
                String body = objectMapper.writeValueAsString(items);
                return response(200, body);
            }

            // GET /inventory-management/inventory/items/{id}
            if (path != null && path.contains("/inventory/items/")) {
                String idString = path.substring(path.lastIndexOf('/') + 1);
                long id;
                try {
                    id = Long.parseLong(idString);
                } catch (NumberFormatException e) {
                    return response(400, "{\"error\":\"Invalid item id: " + idString + "\"}");
                }

                Optional<InventoryItem> itemOpt = inventoryRepository.findById(id);
                if (itemOpt.isEmpty()) {
                    return response(404, "{\"error\":\"Item not found\"}");
                }

                String body = objectMapper.writeValueAsString(itemOpt.get());
                return response(200, body);
            }

            // GET /inventory-management/inventory/items?name=itemName
            if (path != null && path.endsWith("/inventory/items")) {
                Map<String, String> queryParams = event.getQueryStringParameters();
                String name = queryParams != null ? queryParams.get("name") : null;

                if (name == null || name.isBlank()) {
                    return response(400, "{\"error\":\"Missing required query parameter 'name'\"}");
                }

                List<InventoryItem> items = inventoryRepository.findByName(name);
                String body = objectMapper.writeValueAsString(items);
                return response(200, body);
            }

            // If we reach here, path did not match any known endpoint
            return response(404, "{\"error\":\"Not found\"}");

        } catch (Exception e) {
            // Log to CloudWatch via Lambda context logger if desired
            if (context != null && context.getLogger() != null) {
                context.getLogger().log("Error in InventoryController: " + e.getMessage());
            }
            return response(500, "{\"error\":\"Internal server error\"}");
        }
    }

    private APIGatewayProxyResponseEvent response(int statusCode, String body) {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(statusCode)
                .withHeaders(Map.of(
                        "Content-Type", "application/json",
                        "Access-Control-Allow-Origin", "*",
                        "Access-Control-Allow-Methods", "GET,OPTIONS",
                        "Access-Control-Allow-Headers", "Content-Type"
                ))
                .withBody(body);
    }
}
