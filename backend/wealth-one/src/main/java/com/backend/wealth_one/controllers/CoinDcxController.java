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

    public ResponseEntity<String> callApi(String endpoint, HttpMethod method, Map<String, Object> additionalParams) throws ApiException {
        try {
            // Create base request body with timestamp
            Map<String, Object> body = new HashMap<>();
            body.put("timestamp", System.currentTimeMillis());

            // Add any additional parameters
            if (additionalParams != null) {
                body.putAll(additionalParams);
            }

            // Get authentication headers
            HttpHeaders headers = authService.generateAuthHeaders(body);

            // Create HTTP entity
            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);

            // Make the request
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

    @PostMapping("/user-info")
    public ResponseEntity<?> getUserBalances() {
        try {
            return callApi("/exchange/v1/users/info", HttpMethod.POST, null);
        } catch (ApiException e) {
            logger.error("Error getting user balances", e);
            return createErrorResponse(e);
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
}