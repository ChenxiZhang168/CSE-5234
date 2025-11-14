package com.example.payment_processing;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.example.payment_processing.dto.PaymentRequestDTO;
import com.example.payment_processing.dto.PaymentResponseDTO;
import com.google.gson.Gson;

import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

public class MockPaymentController implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private static final Gson gson = new Gson();

    // fake auto-increment for payment_info_id
    private static final AtomicLong ID_GENERATOR = new AtomicLong(1);

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            if (!"POST".equalsIgnoreCase(request.getHttpMethod())) {
                return textResponse(405, "Method Not Allowed");
            }

            String body = request.getBody();
            PaymentRequestDTO paymentRequest = gson.fromJson(body, PaymentRequestDTO.class);

            // You could add some simple validation; for lab we just approve.
            long paymentInfoId = ID_GENERATOR.getAndIncrement();

            PaymentResponseDTO responseDto = new PaymentResponseDTO(
                    paymentInfoId,
                    "APPROVED",
                    "Mock payment approved"
            );

            String json = gson.toJson(responseDto);

            return new APIGatewayProxyResponseEvent()
                    .withStatusCode(200)
                    .withHeaders(Map.of(
                            "Content-Type", "application/json",
                            "Access-Control-Allow-Origin", "*"
                    ))
                    .withBody(json);

        } catch (Exception e) {
            return textResponse(500, "Error in mock payment service: " + e.getMessage());
        }
    }

    private APIGatewayProxyResponseEvent textResponse(int statusCode, String message) {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(statusCode)
                .withHeaders(Map.of(
                        "Content-Type", "text/plain",
                        "Access-Control-Allow-Origin", "*"
                ))
                .withBody(message);
    }
}