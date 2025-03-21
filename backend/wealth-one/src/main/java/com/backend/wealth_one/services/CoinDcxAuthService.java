package com.backend.wealth_one.services;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Map;

@Service
public class CoinDcxAuthService {

    @Value("${coindcx.api.key}")
    private String apiKey;

    @Value("${coindcx.api.secret}")
    private String secretKey;

    public HttpHeaders generateAuthHeaders(Map<String, Object> requestBody) {
        try {
            // Calculate signature
            String payload = new JSONObject(requestBody).toString();
            String signature = generateHmacSHA256Signature(payload, secretKey);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-AUTH-APIKEY", apiKey);
            headers.set("X-AUTH-SIGNATURE", signature);
            headers.set("Content-Type", "application/json");

            return headers;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate authentication headers: " + e.getMessage(), e);
        }
    }

    private String generateHmacSHA256Signature(String data, String secret) throws Exception {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes());
            return bytesToHex(hash);
        } catch (Exception e) {
            throw new Exception("Error generating HMAC signature: " + e.getMessage(), e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}