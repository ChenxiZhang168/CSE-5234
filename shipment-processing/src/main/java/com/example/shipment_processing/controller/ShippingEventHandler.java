package com.example.shipment_processing.controller;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SNSEvent;
import com.example.shipment_processing.dto.ShippingRequestDTO;
import com.example.shipment_processing.repo.ShippingRepository;
import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

public class ShippingEventHandler implements RequestHandler<SNSEvent, Void> {

    private final Gson gson = new Gson();
    private final ShippingRepository shippingRepository = new ShippingRepository();

    // Envelope for EventBridge -> SNS message
    static class EventBridgeEnvelope {
        @SerializedName("detail")
        ShippingRequestDTO detail;
    }

    @Override
    public Void handleRequest(SNSEvent event, Context context) {
        try {
            if (event.getRecords() != null) {
                for (SNSEvent.SNSRecord record : event.getRecords()) {
                    String message = record.getSNS().getMessage();

                    // message is the full EventBridge event JSON
                    EventBridgeEnvelope envelope = gson.fromJson(message, EventBridgeEnvelope.class);
                    if (envelope != null && envelope.detail != null) {
                        shippingRepository.save(envelope.detail);
                    } else {
                        if (context != null && context.getLogger() != null) {
                            context.getLogger().log("ShippingEventHandler: envelope or detail is null; message=" + message);
                        }
                    }
                }
            }
        } catch (Exception ex) {
            if (context != null && context.getLogger() != null) {
                context.getLogger().log("Error processing shipping event: " + ex.getMessage());
            }
        }
        return null;
    }
}