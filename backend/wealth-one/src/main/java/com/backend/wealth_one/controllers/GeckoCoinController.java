package com.backend.wealth_one.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@RestController
@RequestMapping("/api/crypto")
public class GeckoCoinController {

    @Value("${coinmarketcap.api.key}")
    private String cmcApiKey;

    private final String cmcBaseUrl = "https://pro-api.coinmarketcap.com";
    private final RestTemplate restTemplate;

    public GeckoCoinController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private Map<String, Object> callCmcApi(HttpMethod method, String endpoint, Map<String, String> params) {
        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromUriString(cmcBaseUrl + endpoint);

        if (params != null && !params.isEmpty()) {
            params.forEach(uriBuilder::queryParam);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");
        headers.set("X-CMC_PRO_API_KEY", cmcApiKey);

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
            @RequestParam(defaultValue = "BTC,ETH") String symbol,
            @RequestParam(defaultValue = "INR") String convert) {

        Map<String, String> params = new HashMap<>();
        params.put("symbol", symbol);
        params.put("convert", convert);

        return callCmcApi(HttpMethod.GET, "/v1/cryptocurrency/quotes/latest", params);
    }

    @GetMapping("/map")
    public Map<String, Object> getCryptoMap() {
        return callCmcApi(HttpMethod.GET, "/v1/cryptocurrency/map", null);
    }
}
