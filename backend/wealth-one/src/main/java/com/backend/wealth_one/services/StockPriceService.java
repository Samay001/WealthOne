package com.backend.wealth_one.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.Map;

@Service
public class StockPriceService implements StockService {

    @Value("${stock.api.baseUrl}")
    private String baseUrl;

    @Value("${stock.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public StockPriceService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public Object getStockPrice(String stockName) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-KEY", apiKey);
        headers.set("Content-Type", "application/json");

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl + "/stock")
                .queryParam("name", stockName);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                entity,
                Map.class);

        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null && responseBody.containsKey("currentPrice")) {
            return Map.of("currentPrice", responseBody.get("currentPrice"));
        } else {
            return Map.of("error", "Price not found");
        }
    }
}