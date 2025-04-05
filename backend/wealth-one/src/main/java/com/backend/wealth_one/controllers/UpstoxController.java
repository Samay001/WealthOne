package com.backend.wealth_one.controllers;

import com.backend.wealth_one.services.UpstoxAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/upstox")
public class UpstoxController {

    private final UpstoxAuthService upstoxAuthService;
    @Autowired
    public UpstoxController(UpstoxAuthService upstoxAuthService) {
        this.upstoxAuthService = upstoxAuthService;
    }

    // Example route to get user profile
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile() {
        try {
            Map<String, Object> profile = upstoxAuthService.makeRequest(HttpMethod.GET, "/user/profile", null);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/funds")
    public ResponseEntity<Map<String, Object>> getFunds() {
        try {
            Map<String, Object> funds = upstoxAuthService.makeRequest(HttpMethod.GET, "/user/get-funds-and-margin", null);
            return ResponseEntity.ok(funds);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/trades-history")
    public ResponseEntity<?> getOrdersHistory() {
        try {
            String segment = "EQ";
            String startDate = "2024-01-01";
            String endDate = "2025-01-01";
            int pageNumber = 1;
            int pageSize = 100;

            String endpoint = String.format(
                    "/charges/historical-trades?segment=%s&start_date=%s&end_date=%s&page_number=%d&page_size=%d",
                    segment, startDate, endDate, pageNumber, pageSize
            );

            Map<String, Object> orderHistory = upstoxAuthService.makeRequest(HttpMethod.GET, endpoint, null);

            return ResponseEntity.ok(orderHistory);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/holdings")
    public ResponseEntity<Map<String, Object>> getHoldings() {
        try {
            Map<String, Object> funds = upstoxAuthService.makeRequest(HttpMethod.GET, "/portfolio/long-term-holdings", null);
            return ResponseEntity.ok(funds);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

}
