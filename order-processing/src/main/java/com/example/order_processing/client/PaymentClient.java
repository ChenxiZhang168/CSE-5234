package com.example.order_processing.client;

import com.example.order_processing.dto.PaymentRequestDTO;
import com.example.order_processing.dto.PaymentResponseDTO;
import com.google.gson.Gson;

import java.io.BufferedReader;
import java.io.OutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class PaymentClient {

    private final String paymentBaseUrl;
    private final Gson gson = new Gson();

    public PaymentClient(String paymentBaseUrl) {
        this.paymentBaseUrl = paymentBaseUrl;
    }

    public PaymentResponseDTO processPayment(PaymentRequestDTO requestDTO) throws Exception {
        String urlStr = paymentBaseUrl + "/payment";
        URL url = new URL(urlStr);

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        String body = gson.toJson(requestDTO);
        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.getBytes());
            os.flush();
        }

        int statusCode = conn.getResponseCode();
        BufferedReader in = new BufferedReader(new InputStreamReader(
                statusCode >= 200 && statusCode < 300 ? conn.getInputStream() : conn.getErrorStream()
        ));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = in.readLine()) != null) {
            response.append(line);
        }
        in.close();
        conn.disconnect();

        if (statusCode != 200) {
            throw new RuntimeException("Payment failed with status " + statusCode + ": " + response);
        }

        return gson.fromJson(response.toString(), PaymentResponseDTO.class);
    }
}