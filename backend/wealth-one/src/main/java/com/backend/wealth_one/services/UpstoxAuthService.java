package com.backend.wealth_one.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class UpstoxAuthService {

    @Value("${upstox.api.key}")
    private String apiKey;

    @Value("${upstox.api.secret}")
    private String apiSecret;

    @Value("${upstox.redirect.uri}")
    private String redirectUri;

    private final String baseUrl = "https://api.upstox.com/v2";
    private String accessToken;
    private String refreshToken;
    private final RestTemplate restTemplate;

    public UpstoxAuthService() {
        this.restTemplate = new RestTemplate();
    }

    // Generate authorization URL for OAuth authentication
    public String getAuthorizationUrl() {
        return UriComponentsBuilder
                .fromHttpUrl("https://api.upstox.com/v2/login/authorization/dialog")
                .queryParam("client_id", apiKey)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", "orders holdings profile")
                .toUriString();
    }

    // Exchange authorization code for access token
    public Map<String, Object> getAccessToken(String authorizationCode) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("code", authorizationCode);
        formData.add("client_id", apiKey);
        formData.add("client_secret", apiSecret);
        formData.add("redirect_uri", redirectUri);
        formData.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(
                    baseUrl + "/login/authorization/token",
                    request,
                    Map.class
            );

            if (response != null) {
                this.accessToken = (String) response.get("access_token");
                this.refreshToken = (String) response.get("refresh_token");

                Map<String, Object> result = new HashMap<>();
                result.put("accessToken", this.accessToken);
                result.put("refreshToken", this.refreshToken);
                result.put("expiresIn", response.get("expires_in"));

                return result;
            } else {
                throw new RuntimeException("Failed to get access token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error getting access token: " + e.getMessage(), e);
        }
    }

    // Refresh the access token using refresh token
    public Map<String, Object> refreshAccessToken() {
        if (refreshToken == null) {
            throw new IllegalStateException("Refresh token not available");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("refresh_token", refreshToken);
        formData.add("client_id", apiKey);
        formData.add("client_secret", apiSecret);
        formData.add("grant_type", "refresh_token");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(
                    baseUrl + "/login/authorization/token",
                    request,
                    Map.class
            );

            if (response != null) {
                this.accessToken = (String) response.get("access_token");
                this.refreshToken = (String) response.get("refresh_token");

                Map<String, Object> result = new HashMap<>();
                result.put("accessToken", this.accessToken);
                result.put("refreshToken", this.refreshToken);
                result.put("expiresIn", response.get("expires_in"));

                return result;
            } else {
                throw new RuntimeException("Failed to refresh access token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error refreshing token: " + e.getMessage(), e);
        }
    }

    // Helper method to make authenticated API requests
    public Map<String, Object> makeRequest(HttpMethod method, String endpoint, Object data) {
        if (accessToken == null) {
            throw new IllegalStateException("Access token not available. Please authenticate first.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(accessToken);

        HttpEntity<?> request;
        String url = baseUrl + endpoint;

        if (data != null && (method == HttpMethod.POST || method == HttpMethod.PUT)) {
            request = new HttpEntity<>(data, headers);
        } else {
            request = new HttpEntity<>(headers);
            if (data != null) {
                // For GET requests, add query parameters
                UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);
                if (data instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> params = (Map<String, Object>) data;
                    params.forEach(builder::queryParam);
                }
                url = builder.toUriString();
            }
        }

        try {
            return restTemplate.exchange(
                    url,
                    method,
                    request,
                    Map.class
            ).getBody();
        } catch (Exception e) {
            // Handle token expiration
            if (e.getMessage().contains("401") && refreshToken != null) {
                refreshAccessToken();
                return makeRequest(method, endpoint, data);
            }
            throw new RuntimeException("API request failed: " + e.getMessage(), e);
        }
    }
}
