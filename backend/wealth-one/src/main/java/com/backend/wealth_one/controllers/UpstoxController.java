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
public class UpstoxController {

    private final UpstoxAuthService upstoxAuthService;

    @Autowired
    public UpstoxController(UpstoxAuthService upstoxAuthService) {
        this.upstoxAuthService = upstoxAuthService;
    }

    // Route to start the OAuth flow
    @GetMapping("/login")
    public RedirectView login() {
        String authUrl = upstoxAuthService.getAuthorizationUrl();
        return new RedirectView(authUrl);
    }

    // Callback route for OAuth redirect
    @GetMapping("/upstox/callback")
    public String callback(@RequestParam("code") String code, HttpSession session) {
        try {
            // Exchange the authorization code for access token
            Map<String, Object> tokenData = upstoxAuthService.getAccessToken(code);

            // Store tokens in session
            session.setAttribute("accessToken", tokenData.get("accessToken"));
            session.setAttribute("refreshToken", tokenData.get("refreshToken"));

            return "Authentication successful! You can now use the API.";
        } catch (Exception e) {
            return "Authentication failed: " + e.getMessage();
        }
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
}
