package com.backend.wealth_one.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
public class StockPriceRapidApiController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${rapidapi.key}")
    private String rapidapi_key;

    @Value("${rapidapi.host}")
    private String rapidapi_host;

    @GetMapping("/price")
    public Map<String, Object> getStockInfo(@RequestParam(defaultValue = "tata steel") String name) {
        try {
            // Set up headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-rapidapi-key", rapidapi_key);
            headers.set("x-rapidapi-host", rapidapi_host);

            // Create HttpEntity with headers
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Build the URL with the provided stock name
            String encodedName = name.replace(" ", "%20");
            String url = "https://indian-stock-exchange-api2.p.rapidapi.com/stock?name=" + encodedName;

            // Make the request
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            // Parse the JSON response
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            // Extract specific fields you're interested in
            Map<String, Object> result = new HashMap<>();

            // Extract basic company info
            if (rootNode.has("companyName")) {
                result.put("companyName", rootNode.get("companyName").asText());
            }

            if (rootNode.has("industry")) {
                result.put("industry", rootNode.get("industry").asText());
            }

            // Extract current price data
            if (rootNode.has("currentPrice")) {
                JsonNode priceNode = rootNode.get("currentPrice");

                // Get NSE price
                if (priceNode.has("NSE")) {
                    result.put("nsePrice", priceNode.get("NSE").asText());
                }
            }

            return result;

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to retrieve stock data");
            errorResponse.put("message", e.getMessage());
            return errorResponse;
        }
    }
}