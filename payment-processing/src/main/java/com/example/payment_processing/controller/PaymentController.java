package com.example.payment_processing.controller;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.example.payment_processing.dto.PaymentRequestDTO;
import com.example.payment_processing.dto.PaymentResponseDTO;
import com.example.payment_processing.repo.PaymentRepository;
import com.google.gson.Gson;

import java.util.Map;

public class PaymentController implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private static final Gson gson = new Gson();
    private final PaymentRepository paymentRepository;

    public PaymentController() {
        this.paymentRepository = new PaymentRepository();
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        try {
            if (!"POST".equalsIgnoreCase(request.getHttpMethod())) {
                return textResponse(405, "Method Not Allowed");
            }

            String body = request.getBody();
            PaymentRequestDTO paymentRequest = gson.fromJson(body, PaymentRequestDTO.class);

            // Save payment info into DB and get real id
            Long paymentInfoId = paymentRepository.save(paymentRequest.getPaymentInfo());

            PaymentResponseDTO responseDto = new PaymentResponseDTO(
                    paymentInfoId,
                    "APPROVED",
                    "Payment approved"
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
            return textResponse(500, "Error in payment service: " + e.getMessage());
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