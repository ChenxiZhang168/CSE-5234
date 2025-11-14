package com.example.order_processing.client;

import com.example.order_processing.dto.InventoryItemDTO;
import com.example.order_processing.dto.OrderItemDTO;
import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

public class InventoryClient {

    private final String inventoryBaseUrl;
    private final Gson gson = new Gson();

    public InventoryClient(String inventoryBaseUrl) {
        this.inventoryBaseUrl = inventoryBaseUrl;
    }

    // fetch one inventory item by id
    private InventoryItemDTO getItem(long itemId) throws Exception {
        String urlStr = inventoryBaseUrl + "/items/" + itemId;
        URL url = new URL(urlStr);

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        int statusCode = conn.getResponseCode();
        if (statusCode != 200) {
            conn.disconnect();
            return null;
        }

        try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            return gson.fromJson(response.toString(), InventoryItemDTO.class);
        } finally {
            conn.disconnect();
        }
    }

    /**
     * For each order item, verify availableQuantity and also copy unitPrice
     * into OrderItemDTO.unitPriceAtPurchase so the database column is correct.
     */
    public boolean validateQuantities(List<OrderItemDTO> items) {
        try {
            for (OrderItemDTO item : items) {
                InventoryItemDTO inv = getItem(item.getItemId());
                if (inv == null) {
                    return false; // item not found
                }

                if (inv.getAvailableQuantity() < item.getQuantity()) {
                    return false; // not enough stock
                }

                // fill unit price from inventory so we don't trust the client for pricing
                item.setUnitPriceAtPurchase(inv.getUnitPrice());
            }
            return true;
        } catch (Exception e) {
            // log in real code
            return false;
        }
    }
}