package com.example.order_processing.client;

import com.amazonaws.services.eventbridge.AmazonEventBridge;
import com.amazonaws.services.eventbridge.AmazonEventBridgeClientBuilder;
import com.amazonaws.services.eventbridge.model.PutEventsRequest;
import com.amazonaws.services.eventbridge.model.PutEventsRequestEntry;
import com.example.order_processing.dto.ShippingRequestDTO;
import com.google.gson.Gson;

/**
 * Publishes shipping events to AWS EventBridge.
 * EventBridge will then route to SNS, which triggers the shipping Lambda.
 */
public class ShippingEventPublisher {

    private final AmazonEventBridge eventBridge;
    private final String eventBusName;
    private final Gson gson = new Gson();

    public ShippingEventPublisher() {
        this.eventBridge = AmazonEventBridgeClientBuilder.defaultClient();
        String bus = System.getenv("EVENT_BUS_NAME");
        if (bus == null || bus.isEmpty()) {
            bus = "default"; // use default bus if not set
        }
        this.eventBusName = bus;
    }

    public void publishShippingRequested(ShippingRequestDTO dto) {
        String detailJson = gson.toJson(dto);

        PutEventsRequestEntry entry = new PutEventsRequestEntry()
                .withSource("order-processing")
                .withDetailType("ShippingRequested")
                .withDetail(detailJson)
                .withEventBusName(eventBusName);

        PutEventsRequest request = new PutEventsRequest()
                .withEntries(entry);

        eventBridge.putEvents(request);
    }
}