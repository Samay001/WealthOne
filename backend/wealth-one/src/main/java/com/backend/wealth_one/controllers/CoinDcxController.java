package com.backend.wealth_one.controllers;

import com.backend.wealth_one.services.CoinDcxAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/coindcx")
public class CoinDcxController {

    private static final Logger logger = LoggerFactory.getLogger(CoinDcxController.class);

    @Value("${coindcx.api.baseUrl}")
    private String baseUrl;

    @Autowired
    private CoinDcxAuthService authService;

    private final RestTemplate restTemplate = new RestTemplate();

    public ResponseEntity<String> callApi(String endpoint, HttpMethod method, Map<String, Object> body) throws ApiException {
        try {
            // Create base payload with timestamp
            Map<String, Object> payload = new HashMap<>();
            long timestamp = System.currentTimeMillis();
            payload.put("timestamp", timestamp);

            // Add additional request body parameters
            if (body != null) {
                payload.putAll(body);
            }

            // Debugging: log full payload
            System.out.println("Payload: " + new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(payload));

            // Generate auth headers with correct payload
            HttpHeaders headers = authService.generateAuthHeaders(payload);

            // Wrap payload and headers into HTTP request
            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(payload, headers);

            // Make the actual API call
            return restTemplate.exchange(
                    baseUrl + endpoint,
                    method,
                    httpEntity,
                    String.class
            );
        } catch (HttpClientErrorException e) {
            throw new ApiException("Client error when calling API: " + e.getResponseBodyAsString(), e, e.getStatusCode().value());
        } catch (HttpServerErrorException e) {
            throw new ApiException("Server error when calling API: " + e.getResponseBodyAsString(), e, e.getStatusCode().value());
        } catch (Exception e) {
            throw new ApiException("Error calling API: " + e.getMessage(), e, 500);
        }
    }



    private ResponseEntity<Map<String, Object>> createErrorResponse(ApiException e) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "error");
        errorResponse.put("message", e.getMessage());
        errorResponse.put("code", e.getStatusCode());

        return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
    }

    public static class ApiException extends Exception {
        private final int statusCode;

        public ApiException(String message, Throwable cause, int statusCode) {
            super(message, cause);
            this.statusCode = statusCode;
        }

        public int getStatusCode() {
            return statusCode;
        }
    }

    @PostMapping("/user-info")
    public ResponseEntity<?> getUserInfo() {
        try {
            return callApi("/exchange/v1/users/info", HttpMethod.POST, null);
        } catch (ApiException e) {
            logger.error("Error getting user balances", e);
            return createErrorResponse(e);
        }
    }

    @PostMapping("/user-balance")
    public ResponseEntity<?> getUserBalances() {
        try {
            return callApi("/exchange/v1/users/balances", HttpMethod.POST, null);
        } catch (ApiException e) {
            logger.error("Error getting user balances", e);
            return createErrorResponse(e);
        }
    }

    @PostMapping("/trade-history")
    public ResponseEntity<?> getTradeHistory() {
        try {
            return callApi("/exchange/v1/orders/trade_history?sort=desc", HttpMethod.POST, null);

        } catch (ApiException e) {
            logger.error("Error getting trade history", e);
            return createErrorResponse(e);
        }
    }

}