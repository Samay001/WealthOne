package com.backend.wealth_one.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@RestController
@RequestMapping("/api/crypto")
public class GeckoCoinController {

    @Value("${gecko.api.key}")
    private String geckoApiKey;

    private final String geckoBaseUrl = "https://api.coingecko.com/api/v3";
    private final RestTemplate restTemplate;

    // Use constructor injection for better testability
    public GeckoCoinController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Spring-managed bean for RestTemplate (you can put this in a config class too)
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    private Map<String, Object> callGeckoApi(HttpMethod method, String endpoint, Map<String, String> params) {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(geckoBaseUrl + endpoint);

        if (params != null && !params.isEmpty()) {
            params.forEach(uriBuilder::queryParam);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");
        headers.set("x-cg-demo-api-key", geckoApiKey); // Proper header key as per CoinGecko docs

        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                uriBuilder.toUriString(),
                method,
                entity,
                Map.class
        );

        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = response.getBody();
        return responseBody != null ? responseBody : new HashMap<>();
    }

    @GetMapping("/prices")
    public Map<String, Object> getCryptoPrices(
            @RequestParam(defaultValue = "solana") String ids,
            @RequestParam(defaultValue = "inr") String vsCurrencies) {

        Map<String, String> params = new HashMap<>();
        params.put("ids", ids);
        params.put("vs_currencies", vsCurrencies);

        return callGeckoApi(HttpMethod.GET, "/simple/price", params);
    }

    @GetMapping("/trending")
    public Map<String, Object> getTrendingCoins() {
        return callGeckoApi(HttpMethod.GET, "/search/trending", null);
    }
}
